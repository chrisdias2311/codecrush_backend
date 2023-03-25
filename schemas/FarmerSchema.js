const mongoose = require("mongoose");

const farmerSchema = mongoose.Schema({
    phone:{
        type: String,
        required:true,
    },
    firstname: {
        type: String,
        // required: true
    },
    lastname: {
        type: String,
        // required: true,
    },
    password: {
        type: String,
        // required: true
    },
    IdImage:{
        type:String,
    },
    verified:{
        type:String,
    }
});


// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);

module.exports = mongoose.model('Farmer', farmerSchema);