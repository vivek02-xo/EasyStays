const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://modernvillasco.com/wp-content/uploads/2024/05/designing-villa-7.jpg",
    },
  },
    price: Number,
    Location: String,
    country: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      }
    ]
});

listingSchema.post("findOneAndDelete" , async function(listing){
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
  

});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;