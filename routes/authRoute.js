const express = require('express');
const { registerController,
    loginController,
    forgotPasswordController,
    updateProfleController,
    getOrderscontroller,
    getAllOrderscontroller,
    orderStatusController,
    allUserController,
    updateUserRoleController } = require('../controllers/authController');
const { requireSignIn, isAdmin } = require('./../middlewares/authMiddleware')

// router object
const router = express.Router();

// routing
// REGISTER || METHOD POST
router.post('/register', registerController);

// LOGIN || METHOD POST
router.post('/login', loginController);

// forgot password || POST

router.post('/forgot-password', forgotPasswordController);

// protected route user auth

router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
})

// protected route admin auth

router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

// upadet profile
router.put('/profile', updateProfleController)

// orders
router.get('/orders/:uid', getOrderscontroller)

// all orders
router.get('/all-orders', getAllOrderscontroller)

// order status update
router.put('/order-status/:orderId', orderStatusController)

// get all users
router.get('/all-users/:myId', allUserController)

// update user role
router.put('/user/:uid', updateUserRoleController)

module.exports = router;