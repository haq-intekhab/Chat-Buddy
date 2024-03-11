const mongoose = require('mongoose');

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('MongoDB connection established!');
    } catch(err){
        console.log("not connected")
        console.error(err.message);
        //Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;