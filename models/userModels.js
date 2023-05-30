let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
        maxLength: [10, "Phone number must be in 10 digit"],
        minLength: [10, "Phone number must be in 10 digit"]
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    answer: {
        type: String
    },
    role: {
        type: Number,
        default: 0
    }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('User', userSchema);