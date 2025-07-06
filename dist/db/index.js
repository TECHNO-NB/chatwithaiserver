import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
export const dbConnect = async () => {
    try {
        const dbs = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log("DB connected");
    }
    catch (error) {
        console.log("Unable to connect mongoDB", error);
        process.exit(1);
    }
};
