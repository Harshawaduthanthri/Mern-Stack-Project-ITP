// controllers/cartController.js

const Product = require('../models/productModel');

const addToCart = async (req, res) => {
  const { _id, quantity } = req.body;

  try {
    const product = await productModel.findById(_id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity in stock' });
    }

    // Update cartQuantity and reduce the quantity in stock
    product.cartQuantity += quantity;
    product.quantity -= quantity;

    await product.save();

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  addToCart,
};
