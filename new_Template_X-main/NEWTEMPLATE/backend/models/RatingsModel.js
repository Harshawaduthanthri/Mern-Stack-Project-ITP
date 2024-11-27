import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products', // Reference to the Product model
      required: true
    },
    rating: {
      type: Number,
      min: 1, // Minimum rating
      max: 5, // Maximum rating
      required: true
    },
    review: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Assuming you have a User model
      required: true,
    },
  },


  { timestamps: true }
);

export default mongoose.model('Rating', ratingSchema);
