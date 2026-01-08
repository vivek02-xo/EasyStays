const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/expressError");
const session = require('express-session');
const flash = require('connect-flash');


const listings = require('./routes/listing');
const reviews = require('./routes/review');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

Main().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
})

async function Main(){
    await mongoose.connect(MONGO_URL);
}
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, '/public')));

const sessionOptions = {
    secret: "thisissecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.get('/',(req, res) => {
    res.render("listings/home.ejs");
});


app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);



// This works in older verson of express.
// app.all("*", (req, res , next) =>{
//     next(new ExpressError(404, "Page Not Found!"));
// });
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) =>{
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs" , {err});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
})


