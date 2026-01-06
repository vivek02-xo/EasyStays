const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/expressError");
const { listingSchema } = require("./schema");

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

app.get('/',(req, res) => {
    res.render("listings/home.ejs");
});

const validateListing = (req, res, next) =>{
    let {error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }else{
        next();
    }
}
// Index Route 
app.get("/listings" , wrapAsync(async (req, res) =>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing})
}));

// new route
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

// create Route
app.post("/listings", 
    wrapAsync(async (req, res) => {
        if(!req.body.listing){
            throw new ExpressError(400 , "Invalid Listing Data (Send Valid data for listing");
        }
        const newListing = new Listing(req.body.listing);
        if(!newListing.title){
            throw new ExpressError(400 , "Invalid Title!(valid Title is required)");
        }
        if(!newListing.description){
            throw new ExpressError(400 , "Invalid description!(validn description is  required)");
        }
        if(!newListing.Location){
            throw new ExpressError(400 , "Invalid Location!(valid Location is required)");
        }
        await newListing.save();
        res.redirect("/listings");
    })
);

// Edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// Update Route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    const {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));



// app.get('/testlisting', async (req, res) => {
//     let sampleListing = new Listing({
//         title: 'new villa',
//         description: 'A beautiful villa with sea view',
//         price: 1299,
//         Location: 'California',
//         country: 'USA',
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successfull testing");
// });

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


