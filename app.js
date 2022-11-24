const express = require('express');

const app = express();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile-routes');
var bodyParser = require('body-parser')
require('dotenv').config();

//passport setup
const passportSetup = require("./config/passport-setup");

const FacebookStrategy = require('passport-facebook');
const InstagramStrategy = require('passport-instagram');

const mongoose = require('mongoose');
// const cookieSession = require('cookie-session');
const passport = require('passport');
const session = require('express-session')

// set view engine
app.set('view engine', 'ejs');

app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
})); 

app.use(session({

    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false, 
    cookie: {
        secure: false, // if true: only transmit cookie over https
        httpOnly: true, // if true: prevents client side JS from reading the cookie
        maxAge: 1000*60*60*60, // session max age in milliseconds      
        sameSite: 'lax' // make sure sameSite is not none
    }
}))




//initialize passport with cookies
app.use(passport.initialize());

//initailize passport to use session cookie
app.use(passport.session());



mongoose.connect(process.env.MONGO_URI, () => {
    console.log('Connected to MongoDb');
});

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home route
app.get('/', (req, res) => {
    res.render('home', {user:req.user});
});


app.listen(3030, () => {
    console.log(`server has started 'http://localhost:3030'`);
})