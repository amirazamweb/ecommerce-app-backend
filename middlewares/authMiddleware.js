
let jwt = require('jsonwebtoken');
let User = require('./../models/userModels');

const requireSignIn = (req, res, next) => {
    try {
        const decode = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
        req.user = decode;

        next();

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Something went wrong in access'
        })
    }
}

const isAdmin = async (req, res, next) => {

    try {
        const user = await User.findById(req.user.id);

        if (user.role !== 1) {
            return res.send({
                success: false,
                message: 'Unauthorized Access'
            })
        }

        else {
            next();
        }
    } catch (error) {
        console.log(error);

    }

}


module.exports = { requireSignIn, isAdmin }