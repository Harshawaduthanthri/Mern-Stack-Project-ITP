import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from 'morgan'
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'  // Fix typo here
import postRoutes from './routes/postRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import EmployeeRoutes from './routes/EmployeeNotificationRoutes.js';
import ImageRoutes from './routes/imageRoutes.js';
import cors from 'cors'
import FeedbackRoutes from "./routes/FeedbackRoutes.js";
import cardRoutes from './routes/cardRoutes.js'
import attendanceRoutes from './routes/attendanceRoutes.js'
import emailRoutes from './routes/emailRoutes.js'
import contactUsRoutes from "./routes/contactUsRoutes.js";
import calenderEventRoutes from "./routes/calenderEventRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
dotenv.config();

connectDB();

const app = express()
//middleware

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
//routes

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);  // Fix typo here
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/appointment', appointmentRoutes);
app.use('/api/v1/Employee', EmployeeRoutes);
app.use('/api/v1/feedback', FeedbackRoutes );
app.use('/api/v1/image', ImageRoutes );
app.use('/api/v1/attendance', attendanceRoutes );
app.use("/email", emailRoutes);
app.use('/api/v1/getcontact', contactUsRoutes);
app.use('/api/v1/calender', calenderEventRoutes);
app.use('/api/v1/coupon', couponRoutes);
app.get('/', (req, res) => {
    res.send({
        message: 'Welcome '
    })
})

//------------
//middlware for parsing request body(card)
//app.use(express.json())

app.use('/cards', cardRoutes)
//------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`)
})
