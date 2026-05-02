import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Shop from "@/models/Shop";
import User from "@/models/User";

export async function POST(req) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, address, coordinates, deliveryRadius, logo } =
      await req.json();

    if (!name || !description || !address || !coordinates) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if seller already has a shop
    const existingShop = await Shop.findOne({ owner: session.user.id });
    if (existingShop) {
      return NextResponse.json(
        { error: "You already have a shop" },
        { status: 400 }
      );
    }

    const shop = await Shop.create({
      name,
      description,
      owner: session.user.id,
      location: {
        type: "Point",
        coordinates, // [longitude, latitude]
        address,
      },
      deliveryRadius: deliveryRadius || 10,
      logo,
    });

    // Link shop to user
    await User.findByIdAndUpdate(session.user.id, { shop: shop._id });

    return NextResponse.json({ shop }, { status: 201 });
  } catch (error) {
    console.error("Shop creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const shop = await Shop.findOne({ owner: session.user.id });
    return NextResponse.json({ shop });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}