
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Order = require('../models/orderModel');
const fs = require('fs');
const slugify = require('slugify');
var braintree = require('braintree');
const dotenv = require('dotenv');

dotenv.config()

// gateway

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

// create product

const createProductController = async (req, res) => {
    try {

        const { name, description, price, category, quantity } = req.fields
        const { photo } = req.files;

        // validation
        switch (true) {
            case !name:
                return res.send({ error: 'Name is required' })
            case !description:
                return res.send({ error: 'Description is required' })
            case !price:
                return res.send({ error: 'Price is required' })
            case !category:
                return res.send({ error: 'Category is required' })
            case !quantity:
                return res.send({ error: 'Quantity is required' })
            case !photo:
                return res.send({ error: 'Photo is required' })
        }

        const products = new Product({ ...req.fields, slug: slugify(name) });

        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save();

        res.status(201).send({
            success: true,
            message: 'Product created sucessfully',
            products
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in creating product',
            error
        })
        console.log(error);
    }
}

// get all products

const getProductController = async (req, res) => {
    try {
        const products = await Product.find({}).populate('category').select({ photo: 0 }).limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            count: products.length,
            message: 'all products',
            products
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in getting product',
            error
        })
        console.log(error);
    }
}

// get single product

const getSingleProductController = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug }).populate('category').select({ photo: 0 });
        res.status(200).send({
            success: true,
            message: 'single products',
            product
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in getting single product',
            error
        })
        console.log(error);
    }
}

// get photo

const productPhotoController = async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid).select({ photo: 1 });
        if (product?.photo.data) {
            res.set('Content-type', product.photo.contentType);
            res.status(200).send(product.photo.data)
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while getting product photo',
            error
        })
        console.log(error);
    }
}

// delete product

const deleteProductController = async (req, res) => {
    try {
        let x = await Product.findByIdAndDelete(req.params.pid).select({ photo: 0 });
        res.status(200).send({
            success: true,
            message: 'Product delete successfully'
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while deleting product',
            error
        })
        console.log(error);
    }
}

// update product

const updateProductController = async (req, res) => {

    try {
        const { name, description, price, category, quantity } = req.fields
        const { photo } = req.files;

        const product = await Product.findById(req.params.pid).select({ photo: 0 });

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        let updatedProduct = await Product.findByIdAndUpdate(req.params.pid, { ...photo, name, description, price, category, quantity, slug: slugify(name) }, { new: true }).select({ photo: 0 });

        res.status(201).send({
            success: true,
            message: 'Product updated sucessfully',
            updatedProduct
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while updating product',
            error
        })
        console.log(error);
    }
}

// filter product

const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) {
            args.category = checked;
        }
        if (radio.length > 0) {
            args.price = { $gte: radio[0], $lte: radio[1] };
        }
        let products = await Product.find(args).select({ photo: 0 });
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while filtering product',
            error
        })
        console.log(error);
    }
}

// product count

const productCountController = async (req, res) => {
    try {
        const total = await Product.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in product count',
            error
        })
        console.log(error);
    }
}

// product list base on page
const productListcController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await Product.find({}).select({ photo: 0 }).skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in per page ctrl',
            error
        })
        console.log(error);
    }
}

// search product
const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const results = await Product.find({
            $or: [{ name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } }]
        }).select({ photo: 0 });
        res.json(results);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in search product API',
            error
        })
        console.log(error);
    }
}

// similar product
const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await Product.find({
            category: cid,
            _id: { $nin: [pid] }
        }).select({ photo: 0 }).limit(9).populate('category');

        res.status(200).send({
            success: true,
            products
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in similar product',
            error
        })
        console.log(error);
    }
}

// category wise product

const productCategoryController = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        const products = await Product.find({ category }).populate('category');
        res.status(200).send({
            success: true,
            products,
            category
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while getting product',
            error
        })
        console.log(error);
    }
}

// payment gateway api token
const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err)
            }
            else {
                res.send(response)
            }
        })
    } catch (error) {

    }
}

// payment

const braintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body;
        let total = 0;
        cart.map((i) => { total += i.price });
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },
            function (error, result) {
                if (result) {
                    const order = new Order({
                        products: cart,
                        payment: result,
                        buyer: req.body._id
                    }).save();
                    res.json({ ok: true })
                }
                else {
                    res.status(500).send(error)
                }
            }
        )
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
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
    braintreePaymentController
}