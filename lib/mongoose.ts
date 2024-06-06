import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is missing');
    }

    if (isConnected) {
        // console.log('Using existing connection');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('Connected to DB');
    } catch (err) {
        console.log(err);
    }
};