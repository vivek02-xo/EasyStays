if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/expressError");
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const listingRouter = require('./routes/listing');
const reviewRouter = require('./routes/review');
const userRouter = require('./routes/user');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl = process.env.ATLASDB_URL;
// console.log("DB URL:", process.env.ATLASDB_URL);

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

const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto:{
        secret: process.env.SECRET || "devsecret",
    },
    touchAfter: 24 * 3600,
});

store.on("error" , () => {
    console.log("Error in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});


app.get('/',(req, res) => {
    res.redirect("/listings")
});

app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) =>{
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs" , {err});
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});