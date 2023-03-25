const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    ownerId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    productImage: {
        type: String,
    },
    location: {
        type:String,
    },
    quantity: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    ratingCount:{
        type: Number
    }
});


// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);

module.exports = mongoose.model('Product', productSchema);