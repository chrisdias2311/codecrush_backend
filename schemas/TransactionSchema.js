const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    ownerId: {
        type: String,
        required: true,
    },
    ownerName: {
        type: String,
        required: true
    },
    ownerPhone: {
        type: String,
        required: true,
    },
    ownerLocation: {
        type: String,
        required: true,
    },
    buyerName: {
        type: String,
        required: true,
    },
    buyerPhone: {
        type: String,
        required: true,
    },
    buyerLocation: {
        type:String,
        required: true,
    },
    orderDate: {
        type: String,
        required: true,
    },
    distance:{
        type: String,
    },
    orderId: {
        type: Number,
    },
    status:{
        type:String,
    }, 
    productName:{
        type: String,
    },
    productCategory:{
        type:String
    }
});


// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);

module.exports = mongoose.model('Transaction', transactionSchema);