const mongoose = require("mongoose");


async function connectDB() {
    try {
        if (mongoose.connection.readyState) return;
        const connect = await mongoose.connect(process.env.MONGODB_URL)
        if (connect.connection.port) console.log(`DB connected on port:${connect.connection.port}`)
        else console.log(err?.message ?? "connection failed")
    } catch(err) {
        console.log(err?.message ?? "connection failed")
    }
}
 
connectDB()