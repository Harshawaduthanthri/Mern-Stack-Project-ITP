import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema
(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Assuming you have a User model
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "unread",
      enum: ["unread", "approved", "rejected","pending","done"],
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointment",
      required: true,// Assuming you have an Appointment model
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
