let express = require('express');
let connectDB = require('./config/db')
let authRoutes = require('./routes/authRoute')
let categoryRoutes = require('./routes/categoryRoutes');
let productRoutes = require('./routes/productRoutes');
require('colors');
const cors = require('cors');

// config env
require('dotenv').config();

// database config
connectDB();

let app = express();

app.use(express.json());
app.use(cors());

// routes

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

app.get('/', (req, res) => {
    res.send({ message: 'I am default page' })
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`server is running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
})