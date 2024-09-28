const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const connectDB = require('./config/db')



// initializing express
const  app = express();


// load environment variables
dotenv.config({path: ".env"});

// connect to database
connectDB();


// Body parser setup
app.use(express.json())

// mount routes
const auth = require('./routes/auth');
const user = require('./routes/user');

app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);

const PORT = process.env.PORT



app.listen(PORT, console.log(`SERVER RUNNING ON ${PORT}`))

