const express = require('express');
const { addProduct, listProducts, countProducts, removeProduct, singleProduct, updateProduct, uploadProductImages } = require('../controllers/productController');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/multer');

const productRouter = express.Router();

// Admin routes - protected with adminAuth
productRouter.post('/add', adminAuth, addProduct);
productRouter.post('/upload', adminAuth, upload.array('images', 4), uploadProductImages);

productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/update', adminAuth, updateProduct);

// Public routes
productRouter.get('/count', countProducts);
productRouter.get('/list', listProducts);
productRouter.post('/single', singleProduct);

module.exports = productRouter;
