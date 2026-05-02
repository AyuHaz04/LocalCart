import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // not required because OAuth users won't have a password
    },
    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },
    image: {
      type: String,
    },
    // If user is a seller, reference their shop
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    // Stripe Connect account ID (for sellers receiving payouts)
    stripeAccountId: {
      type: String,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// Prevent model recompilation error in Next.js dev mode
export default mongoose.models.User || mongoose.model("User", UserSchema);