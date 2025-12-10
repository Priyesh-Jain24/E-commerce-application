import mongoose from 'mongoose';

const connectDB = async () => { 

    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
        console.error(`Mongoose connection error: ${err}`);
    });

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
        
    } catch (error) {
        process.exit(1); 
    }       
};

export default connectDB;