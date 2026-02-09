const express = require("express");
const ProductRoutes = express.Router();
const Product = require("../models/Products");
const { auth } = require("../middleware/authMiddleware");
const User = require("../models/User");
ProductRoutes.post("/upload", async (req, res) => {
  try {
    const { name, coins, description } = req.body;

    if (!name || !coins || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = await Product.create({
      name,
      coins,
      description,
    });

    res.status(201).json({
      message: "Product uploaded successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to upload product",
      error: error.message,
    });
  }
});

ProductRoutes.get("/getproducts", auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

ProductRoutes.put("/updatecredits", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { updatecoin } = req.body;
    console.log(userId);
    if (!userId || updatecoin === undefined) {
      return res.status(400).json({
        message: "userId and updatecoin are required",
        success: false,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { credits: updatecoin },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Credits updated successfully",
      data: updatedUser,
      success: true,
    });
  } catch (err) {
    console.error("Error updating credits:", err.message);
    return res.status(500).json({
      message: "Error updating credits",
      error: err.message,
      success: false,
    });
  }
});

module.exports = ProductRoutes;
