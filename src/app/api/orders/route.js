import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    let orders;

    if (role === "seller") {
      orders = await Order.find({ seller: session.user.id })
        .populate("product", "name images price")
        .populate("buyer", "name email")
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ buyer: session.user.id })
        .populate("product", "name images price")
        .populate("seller", "name email")
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}