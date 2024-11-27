import mongoose from "mongoose";

const cardSchema = mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    exdate: {
      type: Date,
      required: true,
    },
    cvv: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Card = mongoose.model("Card", cardSchema);
