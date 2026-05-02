import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Shop from "@/models/Shop";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, price, images, category, stock } =
      await req.json();

    if (!name || !description || !price || !images?.length || !category) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const shop = await Shop.findOne({ owner: session.user.id });
    if (!shop) {
      return NextResponse.json(
        { error: "Create a shop first" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      images,
      category,
      stock: parseInt(stock),
      shop: shop._id,
      seller: session.user.id,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId");

    const query = shopId ? { shop: shopId } : {};
    const products = await Product.find(query).populate("shop");

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}