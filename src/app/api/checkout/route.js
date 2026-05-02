import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import razorpay from "@/lib/razorpay";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await req.json();

    await connectDB();

    const product = await Product.findById(productId).populate("shop");

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Not enough stock" },
        { status: 400 }
      );
    }

    const totalAmount = product.price * quantity;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        productId: product._id.toString(),
        buyerId: session.user.id,
        sellerId: product.seller.toString(),
        quantity: quantity.toString(),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      productName: product.name,
      productImage: product.images[0],
      buyerName: session.user.name,
      buyerEmail: session.user.email,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}