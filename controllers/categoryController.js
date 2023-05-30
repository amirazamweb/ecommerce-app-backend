
const Category = require('../models/categoryModel');
const slugify = require('slugify');

// create category

const createCategoryController = async (req, res) => {
    try {

        const { name } = req.body;

        if (!name) {
            return res.status(401).send({
                message: 'Name is required'
            })
        }

        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(200).send({
                success: false,
                message: 'Category already exist'
            })
        }

        const category = await Category.create({ name, slug: slugify(name) });

        res.status(201).send({
            success: true,
            message: 'new category created',
            category
        })

    } catch (error) {

        res.status(500).send({
            success: false,
            error,
            message: "Error in category"
        })
        console.log(error);
    }
}

// update category

const updateCategoryController = async (req, res) => {

    try {

        const { name } = req.body;
        const { id } = req.params;

        const category = await Category.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });

        res.status(200).send({
            success: true,
            messgae: 'Category updated sucessfully',
            category
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error while updating category"
        })
        console.log(error);
    }
}

// getting all category

const categoriesController = async (req, res) => {
    try {

        const categories = await Category.find();

        res.status(200).send({
            success: true,
            messgae: 'All categories list',
            categories
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting all category"
        })
        console.log(error);
    }
}

// single category

const singleCategoryController = async (req, res) => {
    try {

        const category = await Category.findOne({ slug: req.params.slug });

        res.status(200).send({
            success: true,
            messgae: 'Get single category successfull',
            category
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting single category"
        })
        console.log(error);
    }
}

// delete category

const deleteCategoryController = async (req, res) => {
    try {

        await Category.findByIdAndDelete(req.params.id);

        res.status(200).send({
            success: true,
            messgae: 'Category deleted successfully',
        })


    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error while deleting category"
        })
        console.log(error);
    }
}

module.exports = { createCategoryController, updateCategoryController, categoriesController, singleCategoryController, deleteCategoryController }