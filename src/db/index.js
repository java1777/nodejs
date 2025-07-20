import { connect } from "mongoose";
import {config } from 'dotenv';
config();

export const connectDb = async ()=>{
    try {
       await connect(process.env.MONGO_URI);
       console.log('connected to db');
       
    } catch (error) {
        console.log(`error on connected db :${error.message}`);
        
    }
}