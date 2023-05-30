
const express = require('express');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
const { createCategoryController, updateCategoryController, categoriesController, singleCategoryController, deleteCategoryController } = require('../controllers/categoryController')

const router = express.Router();

// create categpry || POST

router.post('/create-category', createCategoryController);

// update category || PUT

router.put('/update-category/:id', updateCategoryController)

// get all category || GET

router.get('/get-category', categoriesController);

// get single category || GET

router.get('/single-category/:slug', singleCategoryController);

// delete category || DELETE

router.delete('/delete-category/:id', deleteCategoryController);

module.exports = router;