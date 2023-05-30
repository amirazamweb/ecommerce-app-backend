
let mongoose = require('mongoose');

require('colors');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);

        console.log(`Connected to MongoDB Database ${conn.connection.host}`.bgMagenta.white);

    } catch (error) {

        console.log(`Error to MongoDB: ${error}`.bgRed.white);

    }
}

module.exports = connectDB;