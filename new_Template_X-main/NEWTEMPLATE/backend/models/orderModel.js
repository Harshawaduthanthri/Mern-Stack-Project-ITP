// Import necessary modules
import mongoose from "mongoose";
import Product from "./productModel.js"; // Assuming you have a product model file

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "delivered", "cancel"],
    },
  },
  { timestamps: true }
);

// Middleware to update product quantities when an order is saved
orderSchema.post("save", async function (doc, next) {
  try {
    // Loop through products in the order
    for (const productId of doc.products) {
      // Find the product and update its quantity
      const product = await Product.findById(productId);
      if (product) {
        product.quantity -= 1; // Reduce quantity by 1 for each product
        if (product.quantity <= 0) {
          product.quantity = 0; // Set quantity to 0 if it becomes negative
          console.log(`Low stock for product: ${product.name}`);
        }
        await product.save(); // Save the updated product
      }
    }
    next(); // Continue with next middleware or operation
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});


export default mongoose.model("Order", orderSchema);
