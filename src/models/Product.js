import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String], // array of URLs from uploadthing
      required: true,
    },
    category: {
      type: String,
      enum: [
        "jewelry",
        "pottery",
        "clothing",
        "art",
        "food",
        "candles",
        "other",
      ],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // Stripe product/price ID for checkout
    stripePriceId: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);