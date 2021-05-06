import express from 'express';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
  })
);

// @desc    Fetch product by id
// @route   GET /api/v1/products/:id
// @access  Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    console.log('id: ' + req.params.id);

    try {
      const product = await Product.findById(req.params.id);
      res.json(product);
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: 'Product not found' });
    }
  })
);

export default router;
