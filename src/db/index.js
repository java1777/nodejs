import { connect } from "mongoose";
import { config } from "dotenv";
config();

export async function connectDB (){
    try {
        await connect(process.env.MONGO_URI);
        console.log('Database connected');
    } catch (error) {
        console.log(error);
    }
}