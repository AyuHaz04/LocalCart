import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Shop's physical location for map display
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    // Delivery radius in kilometers
    deliveryRadius: {
      type: Number,
      default: 10,
    },
    logo: {
      type: String, // URL from uploadthing
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// This enables geo queries (finding shops near a location)
ShopSchema.index({ location: "2dsphere" });

export default mongoose.models.Shop || mongoose.model("Shop", ShopSchema);