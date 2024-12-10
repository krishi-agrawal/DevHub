import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/connectDB.js"
import authRoutes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"

dotenv.config()
const PORT = process.env.PORT || 8000
const app = express()

app.get("/", (req, res) => {
    res.send("Server is ready..")
})

app.use(express.json())
app.use(express.urlencoded({extended: true})) // added this so that we can use post request in PostMan in the urlencoded format
app.use(cookieParser());
app.use("/api/auth", authRoutes)

// console.log("Database is active at ", process.env.MONGO_URI)

app.listen(8000, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})