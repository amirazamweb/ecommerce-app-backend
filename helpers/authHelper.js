
let bcrypt = require('bcrypt');

let jwt = require('jsonwebtoken');

const hashPassword = (password) => {

    try {
        let salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);

    } catch (error) {
        console.log(error);
    }
}

const comparePassword = (password, hashedPassword) => {
    try {
        return bcrypt.compareSync(password, hashedPassword);
    } catch (error) {
        console.log(error);
    }
}

const createToken = (id) => {

    try {
        return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7h' });
    } catch (error) {
        console.log(error);
    }

}

module.exports = { hashPassword, comparePassword, createToken }