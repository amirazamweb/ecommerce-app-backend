
const express = require('express');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
const {
    createProductController,
    getProductController,
    getSingleProductController,
    productPhotoController,
    deleteProductController,
    updateProductController,
    productFilterController,
    productCountController,
    productListcController,
    searchProductController,
    relatedProductController,
    productCategoryController,
    braintreeTokenController,
    braintreePaymentController } = require('../controllers/productController');
const formidable = require('express-formidable');

const router = express.Router();

// create product || POST

router.post('/create-product', formidable(), createProductController);

// update product

router.put('/update-product/:pid', formidable(), updateProductController);

// get product || GET

router.get('/get-product', getProductController);

// get single product || GET

router.get('/get-product/:slug', getSingleProductController);

// get photo

router.get('/product-photo/:pid', productPhotoController)

// delete product 

router.delete('/delete-product/:pid', deleteProductController)

// filter product || POST

router.post('/product-filters', productFilterController)

// product count
router.get('/product-count', productCountController)

// product per page
router.get('/product-list/:page', productListcController)

// search product
router.get('/search/:keyword', searchProductController)

// similar product
router.get('/related-product/:pid/:cid', relatedProductController)

// category wise product
router.get('/product-category/:slug', productCategoryController)

// payment route
// token
router.get('/braintree/token', braintreeTokenController);

// payments
router.post('/braintree/payment', braintreePaymentController)

module.exports = router;