import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      quantity,
      totalAmount,
      deliveryAddress,
    } = await req.json();

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findById(productId);
    const seller = await User.findById(product.seller);
    const buyer = await User.findById(session.user.id);

    // Create order
    const order = await Order.create({
      buyer: session.user.id,
      seller: product.seller,
      product: productId,
      quantity: parseInt(quantity),
      totalAmount: parseFloat(totalAmount),
      status: "confirmed",
      isPaid: true,
      stripePaymentIntentId: razorpay_payment_id,
      deliveryAddress,
    });

    // Reduce stock
    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: -parseInt(quantity) },
    });

    // Send emails to buyer and seller
    await fetch(`${process.env.NEXTAUTH_URL}/api/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "order_confirmation",
        buyerEmail: buyer.email,
        buyerName: buyer.name,
        sellerEmail: seller.email,
        sellerName: seller.name,
        productName: product.name,
        quantity,
        totalAmount,
        deliveryAddress,
        orderId: order._id.toString(),
      }),
    });

    console.log("✅ Order created and emails sent:", order._id);

    return NextResponse.json({ success: true, orderId: order._id });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}