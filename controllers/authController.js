let { hashPassword, comparePassword, createToken } = require('../helpers/authHelper');

let User = require('../models/userModels');
let Order = require('../models/orderModel');

const registerController = async (req, res) => {
    try {
        let { name, email, password, phone, address, answer } = req.body;

        if (!name) {
            return res.send({
                success: false,
                message: 'Name is required'
            })
        }

        if (!email) {
            return res.send({
                success: false,
                message: 'Email is required'
            })
        }

        if (!password) {
            return res.send({
                success: false,
                message: 'Password is required'
            })
        }

        if (phone.length != 10) {
            return res.send({
                success: false,
                message: 'Not a valid phone number'
            })
        }

        if (!address) {
            return res.send({
                success: false,
                message: 'Address is required'
            })
        }

        if (!answer) {
            return res.send({
                success: false,
                message: 'Answer is required'
            })
        }

        // existing user;

        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Email already registered, please login'
            })
        }

        // register user

        const hashPW = hashPassword(password);

        let user = await User.create({ name, email, password: hashPW, phone, address, answer });

        res.status(201).send({
            success: true,
            message: 'Registration succesfull',
            user
        })

    }
    catch (error) {

        console.log(error);

        res.status(500).send({
            success: false,
            message: error
        })
    }
}

// login cntroller

const loginController = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Invalid email or password'
            })
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(200).send({
                success: false,
                message: 'Email not registered'
            })
        }

        let isPasswordMatch = comparePassword(password, user.password);

        if (!isPasswordMatch) {
            return res.status(200).send({
                success: false,
                message: 'Invalid password'
            })
        }

        const token = createToken(user._id);

        res.status(200).send({
            success: true,
            message: 'Login sucessfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }

}

// forgot password controller

const forgotPasswordController = async (req, res) => {

    try {

        const { email, answer, newPassword } = req.body;

        if (!email) {
            return res.status(400).send({ message: 'Email is required' })
        }

        if (!answer) {
            return res.status(400).send({ message: 'Answer is required' })
        }

        if (!newPassword) {
            return res.status(400).send({ message: 'New Password is required' })
        }

        let user = await User.findOne({ email, answer });

        let hpw = hashPassword(newPassword);

        if (!user) {
            return res.status(201).send({
                success: false,
                message: 'Wrong Email or Answer'
            })
        }

        await User.findByIdAndUpdate(user._id, { password: hpw });

        res.status(201).send({
            success: true,
            message: 'Passowrd reset sucessfully'
        })


    } catch (error) {

        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })

    }

}

// update profile
const updateProfleController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const hashedPassword = password && hashPassword(password);
        const user = await User.findOne({ email });
        const updatedUser = await User.findByIdAndUpdate(user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                address: address || user.address,
                phone: phone || user.phone
            }, { new: true }).select({ password: 0, answer: 0 });
        res.status(201).send({
            success: true,
            message: 'Pofile updated successfully',
            updatedUser: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                role: updatedUser.role
            }
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })
        console.log(error);
    }
}

// orders

const getOrderscontroller = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.params.uid })
            .populate('products', '-photo')
            .populate('buyer', 'name');
        res.json(orders);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while getting orders',
            error
        })
        console.log(error);
    }
}

// all orders
const getAllOrderscontroller = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('products', '-photo')
            .populate('buyer', 'name').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while getting all orders',
            error
        })
        console.log(error);
    }
}

// order status
const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        res.json(orders);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while updating order',
            error
        })
        console.log(error);
    }
}

// get all users

const allUserController = async (req, res) => {
    const { myId } = req.params;
    try {
        let users = await User.find({ _id: { $nin: [myId] } }).select({ password: 0 }).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while getting all users',
            error
        })
        console.log(error);
    }
}

// update user role
const updateUserRoleController = async (req, res) => {
    try {
        const { role } = req.body;
        const { uid } = req.params;
        const user = await User.findByIdAndUpdate(uid, { role }, { new: true });
        res.status(201).send({
            success: true,
            message: 'User role is updated',
            user
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while upadting user role',
            error
        })
        console.log(error);
    }
}

module.exports = {
    registerController,
    loginController,
    forgotPasswordController,
    updateProfleController,
    getOrderscontroller,
    getAllOrderscontroller,
    orderStatusController,
    allUserController,
    updateUserRoleController
};

