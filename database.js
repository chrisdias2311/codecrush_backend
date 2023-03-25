const mongoose = require('mongoose');

const url = `mongodb+srv://bytehogs69:bytehogs987654@cluster0.wf0w9fv.mongodb.net/?retryWrites=true&w=majority`;



const connectDB = async () => {
    try{
        const conn = await mongoose.connect(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log(`MongoDB connected to  ${conn.connection.host}`);
    } catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;

// uniExmembers2311: password