import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export const protectRoute = async(req, res, next) => {
    try {
        const token = req.cookies.jwt //we need to add app.use(cookieParser()) in order to use this
        //we will get the jwt from the cookie sent by the client side req
        if(!token){
            return res.status(401).json({error: "Unauthorizzed: No token provided."})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) // decoded here stores the payload that we set when signing the token
                                                                // in this case its {userdId: user._id}
        if(!decoded){
            return res.status(401).json({error: "Token not valid."})
        }

        const user = await User.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(400).json({error: "User not found."})
        }

        req.user = user
        next()

    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
		return res.status(500).json({ error: "Internal Server Error" });
    }
}

// basically i want my user profile through getMe, and for that first the server if i am a legitimate user or not,
// so for that the server first checks idf there is a cookie with a jwt and then check if its valid.
// if it is valid, then the server extracts the userId or user._id through the payload in the jwt
// once the server has the userId, it queries the DB for the user with that id
// the, in the req, it sets req.user = user
// then in the getMe controller, the user extracted through req.user._id

// Why do I need this??
// Mainly to prevent attacks if the cookie has been stolen through XSS(Cross Site Scripting) 
// Checking the jwt token again is important as it ensures that the token has been either manipulated(different IP address) or it has been expired
// thats why its also important to expire tokens frequently 