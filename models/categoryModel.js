
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        lowercase: true
    }
}, { versionKey: false, timestamps: true })

module.exports = mongoose.model('Category', categorySchema);