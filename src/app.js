const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

const{NotFoundError,ValidationError,AuthenticationError}=require("./presentation/errors/customError")
const{profileRoutes,userRoutes,requestRoutes,authMiddleware,RabitMqConsumer,newUserFormSignup,IspremiumUpdate}=require("../container")

//RabitMqConsumer.connect().then(()=>RabitMqConsumer.listen())
newUserFormSignup.connect().then(()=>newUserFormSignup.listen())
   
app.use("/",(req, res, next) => authMiddleware.verifyToken(req, res, next), profileRoutes.getRouter());
app.use("/",(req, res, next) => authMiddleware.verifyToken(req, res, next),userRoutes.getRouter())
app.use("/",(req, res, next) => authMiddleware.verifyToken(req, res, next),requestRoutes.getRouter())

app.use((err, req, res, next) => {
    console.log(err);
    
    if (err instanceof NotFoundError) {
        return res.status(404).json({ message: err.message });
    }
    if (err instanceof ValidationError) {
        return res.status(400).json({ message: err.message });
    }
    if (err instanceof AuthenticationError) {
        return res.status(401).json({ message: err.message });
    }
    res.status(500).json({ message: 'Internal Server Error' });
});

// Database Connection
mongoose.connect("mongodb+srv://ROBINSRK:ROBINSRK123@letsconnect.z1hp8.mongodb.net/User_service?retryWrites=true&w=majority&appName=LetsConnect")
    .then(() => {
        console.log('Database connected successfully');
        app.listen(7000, () => console.log('Server running on port 7000'));
    })
    .catch((err) => console.error('Database connection error:', err));