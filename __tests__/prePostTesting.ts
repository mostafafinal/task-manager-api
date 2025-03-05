import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDBForTesting = async () => {
    try {
        const dbUri = process.env.MONGO_URL as string;

        await mongoose.connect(dbUri);

        console.log("Mongo connected");
    } catch (error) {
        console.error(error);
    }
};

const closeDBForTesting = async () => {
    try {
        await mongoose.connection.close();

        console.log("Mongo disconnected");
    } catch (error) {
        console.error(error);
    }
};

export { connectDBForTesting, closeDBForTesting };
