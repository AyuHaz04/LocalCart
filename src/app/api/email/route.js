import { NextResponse } from "next/server";
import resend from "@/lib/resend";
import { orderConfirmationEmail, newOrderSellerEmail } from "@/lib/emailTemplates";

export async function POST(req) {
  try {
    const {
      type,
      buyerEmail,
      buyerName,
      sellerEmail,
      sellerName,
      productName,
      quantity,
      totalAmount,
      deliveryAddress,
      orderId,
    } = await req.json();

    if (type === "order_confirmation") {
      // Email to buyer
      await resend.emails.send({
        from: "LocalCraft <onboarding@resend.dev>",
        to: buyerEmail,
        subject: "✅ Order Confirmed — LocalCraft",
        html: orderConfirmationEmail({
          buyerName,
          productName,
          quantity,
          totalAmount,
          deliveryAddress,
          orderId,
        }),
      });

      // Email to seller
      await resend.emails.send({
        from: "LocalCraft <onboarding@resend.dev>",
        to: sellerEmail,
        subject: "🎉 New Order Received — LocalCraft",
        html: newOrderSellerEmail({
          sellerName,
          buyerName,
          productName,
          quantity,
          totalAmount,
          deliveryAddress,
        }),
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}