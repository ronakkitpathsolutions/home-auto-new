import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config()

const options = {
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10*1000, // 1s timeout
  };
const db = mongoose.connect(process.env.CONNECTION_URL, options).then(() => {
    console.log('connection successfully')
}).catch((error) => {
    console.log('error', error)
})

export default db