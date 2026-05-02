import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Shop from "@/models/Shop";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lng = parseFloat(searchParams.get("lng"));
    const lat = parseFloat(searchParams.get("lat"));
    const radius = parseFloat(searchParams.get("radius") || "20"); // km

    if (isNaN(lng) || isNaN(lat)) {
      return NextResponse.json(
        { error: "Valid lng and lat are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // MongoDB geospatial query — finds shops within radius
    const shops = await Shop.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: radius * 1000, // convert km to meters
        },
      },
    }).populate("owner", "name email");

    return NextResponse.json({ shops });
  } catch (error) {
    console.error("Nearby shops error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}