import express from "express"
import dotenv from "dotenv"
import {v2 as cloudinary} from "cloudinary"
import connectDB from "./db/connectDB.js"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/post.routes.js"
import notificationRoutes from "./routes/notification.routes.js"
import cookieParser from "cookie-parser"

dotenv.config()
const PORT = process.env.PORT || 8000
const app = express()

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test route
app.get("/", (req, res) => {
    res.send("Server is ready..")
})

// Middleware
app.use(express.json({limit: "5mb"}))
app.use(express.urlencoded({extended: true})) // added this so that we can use post request in PostMan in the urlencoded format
app.use(cookieParser());

// Main routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/post", postRoutes)
app.use("/api/notification", notificationRoutes)


app.listen(8000, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})