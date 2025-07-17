import { config } from 'dotenv'
import { connect } from 'mongoose'
config()

export const connectDB = async () => {
    try {
        await connect(process.env.MONGOOSE_DB)
        console.clear()
        console.log('connect to db');
    } catch (error) {
        console.log('error in connect', error.message);
        process.exit(1)
    }
}