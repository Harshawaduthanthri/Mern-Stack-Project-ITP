import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
import Ratings from "../models/RatingsModel.js";
import braintree from "braintree";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import orderModel from "../models/orderModel.js";
import User from "../models/userModel.js";
import { validationResult } from 'express-validator';
import mongoose from 'mongoose'; // Import mongoose library
import moment from "moment";
import BwipJs from "bwip-js";
import asyncHandler from "express-async-handler";
dotenv.config();

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate('category')
      .select('-photo')
      .limit(12)
      .sort({ createdAt: -1 })
      .lean(); // Use lean() to get plain JavaScript objects instead of mongoose documents

    // Fetch barcodes for each product
    const productsWithBarcodes = await Promise.all(products.map(async (product) => {
      if (!product.barcode) {
        // Generate barcode using bwip-js if the barcode is missing
        const barcodeBuffer = await BwipJs.toBuffer({
          bcid: 'code128',
          text: product._id.toString(),
          scale: 3,
          height: 10,
          includetext: true,
        });

        // Save the barcode as a base64 string and update the product
        product.barcode = barcodeBuffer.toString('base64');
        await productModel.findByIdAndUpdate(product._id, { barcode: product.barcode });
      }
      return product;
    }));

    res.status(200).send({
      success: true,
      countTotal: productsWithBarcodes.length,
      message: 'All Products',
      products: productsWithBarcodes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in getting products',
      error: error.message,
    });
  }
};
// get single product


export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate("category");

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    // Fetching sales data based on orders containing this product
    const salesData = await orderModel.aggregate([
      {
        $unwind: "$products", // Split the products array into separate documents
      },
      {
        $match: {
          "products": new mongoose.Types.ObjectId(product._id), // Match products with the current product ID
          "status": { $in: ["Shipped", "delivered"] }, // Consider only shipped or delivered orders
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group sales by month
          totalSales: { $sum: 1 }, // Count the number of orders
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);

    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
      salesData, // Include actual sales data based on orders
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error,
    });
  }
};
// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};
//delete controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//upate producta
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

//get product by category

export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

///payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const mostBoughtItemsController = async (req, res) => {
  try {
    const mostBoughtItems = await productModel.aggregate([
      { $group: { _id: "$name", totalQuantity: { $sum: "$quantity" } } },
      { $sort: { totalQuantity: -1 } },
    ]);

    // Check if mostBoughtItems is not null or empty
    if (mostBoughtItems && mostBoughtItems.length > 0) {
      res.status(200).json({
        success: true,
        mostBoughtItems,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No most bought items found.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in retrieving most bought items.",
      error: error.message,
    });
  }
};

export const createRatingController = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Extract validated data from the request body
    const { rating, review } = req.body;

    // Get user ID from req.user
    const userId = req.user._id; // Assuming req.user contains the user object with _id field

    // Fetch user details including name
    const user = await User.findById(userId); // Assuming User model has findById method

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Create new rating with user details
    const newRating = new Ratings({
      product: req.params.pid,
      rating,
      review,
      user:  userId,
       // Assuming user has a 'name' field
      
    });

    // Save rating to the database without validating
    await newRating.save({ validateBeforeSave: false });

    res.status(201).json({ success: true, message: 'Rating created successfully', rating: newRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create rating', error: error.message });
  }
};
// Controller function to fetch ratings for a specific product
export const getAllRatings = async (req, res) => {
  try {
    // Extract the product ID from the URL parameters
    const productId = req.params.pid;

    // Fetch ratings for the specified product from the database
    const productRatings = await Ratings.find({ product: productId })
      .populate('user', 'name'); // Populate the username field of the User schema

    // Check if ratings were found for the product
    if (!productRatings || productRatings.length === 0) {
      return res.status(404).json({ message: 'No ratings found for this product' });
    }

    // Send the ratings for the product as a response
    res.status(200).json({ success: true, data: productRatings });
  } catch (error) {
    // Handle errors if any occur
    console.error('Error fetching product ratings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product ratings' });
  }
};



export const getAllOfUserRatings = async (req, res) => {
  try {
    // Fetch all ratings from the database along with user and product information
    const allRatings = await Ratings.find()
      .populate('user', 'name')
      .populate('product', 'name'); // Assuming 'name' is a field in the Product schema

    // Check if any ratings were found
    if (!allRatings || allRatings.length === 0) {
      return res.status(404).json({ message: 'No ratings found' });
    }

    // Send all ratings with user and product information as a response
    res.status(200).json({ success: true, data: allRatings });
  } catch (error) {
    // Handle errors if any occur
    console.error('Error fetching ratings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch ratings' });
  }
};



  export const getUserReviews = async (req, res) => {
    try {
      // Get user ID from req.user
      const userId = req.user._id;
  
      // Fetch ratings submitted by the current user only
      const userRatings = await Ratings.find({ user: userId }).populate('product', 'name');
  
      // Check if any ratings were found
      if (!userRatings || userRatings.length === 0) {
        return res.status(404).json({ success: false, message: 'No ratings found for the current user' });
      }
  
      // Send filtered user ratings as a response
      res.status(200).json({ success: true, data: userRatings });
    } catch (error) {
      console.error('Error fetching user ratings:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch user ratings' });
    }
  };
  

export const deleteRatingController = async (req, res) => {
  try {
    // Extract the rating ID from the request parameters
    const ratingId = req.params.rid;
    console.log('Rating ID:', ratingId); // Log the rating ID

    // Check if the rating ID is valid
    if (!mongoose.Types.ObjectId.isValid(ratingId)) {
      return res.status(400).json({ success: false, message: 'Invalid rating ID' });
    }

    // Find the rating by ID and delete it
    const deletedRating = await Ratings.findByIdAndDelete(ratingId);
    console.log('Deleted Rating:', deletedRating); // Log the deleted rating

    // Check if the rating was found and deleted successfully
    if (!deletedRating) {
      return res.status(404).json({ success: false, message: 'Rating not found' });
    }

    // Send a success response with the deleted rating
    res.status(200).json({ success: true, message: 'Rating deleted successfully', deletedRating });
  } catch (error) {
    // Handle errors if any occur
    console.error('Error deleting rating:', error);
    res.status(500).json({ success: false, error: 'Failed to delete rating' });
  }
};


export const generateReport = asyncHandler(async (req, res) => {
  try {
    // Get all orders with populated product details
    const orders = await orderModel.find({}).populate({
      path: "products",
      populate: { path: "category" }, // Populate category details for each product
    });

    // Initialize an object to store report data
    const report = {
      productSales: {}, // Store product sales count and revenue
      categoryPerformance: {}, // Store sales and out-of-stock products by category
      salesTrends: [], // Store historical sales data (if available)
      outOfStockProducts: [], // Store out-of-stock products
      lowStockProducts: [], // Store products with low stock levels
    };

    // Loop through orders to track product sales, revenue, stock status, and category performance
    orders.forEach((order) => {
      order.products.forEach((product) => {
        // Track product sales count and revenue
        if (report.productSales[product.name]) {
          report.productSales[product.name].count += 1;
          report.productSales[product.name].revenue += product.price;
        } else {
          report.productSales[product.name] = {
            count: 1,
            revenue: product.price,
          };
        }

        // Track category performance
        const categoryName = product.category ? product.category.name : "Uncategorized";
        if (report.categoryPerformance[categoryName]) {
          report.categoryPerformance[categoryName].sales += product.price;
          if (product.quantity === 0) {
            report.categoryPerformance[categoryName].outOfStock.push(product.name);
          }
        } else {
          report.categoryPerformance[categoryName] = {
            sales: product.price,
            outOfStock: product.quantity === 0 ? [product.name] : [],
          };
        }

        // Check for low-stock products (add your threshold here)
        if (product.quantity < 5) {
          report.lowStockProducts.push(product.name);
        }
      });
    });

    // Sort product sales by highest revenue to lowest
    const sortedProductSales = Object.entries(report.productSales).sort(
      (a, b) => b[1].revenue - a[1].revenue
    );

    // (Optional) Incorporate historical sales data for sales trends
    // ... (implement logic to retrieve and analyze historical sales data)

    res.status(200).json({
      success: true,
      message: "Report generated successfully",
      productSales: sortedProductSales,
      categoryPerformance: report.categoryPerformance,
      salesTrends: report.salesTrends, // Include historical sales data if available
      outOfStockProducts: report.outOfStockProducts,
      lowStockProducts: report.lowStockProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Error generating report",
    });
  }
});