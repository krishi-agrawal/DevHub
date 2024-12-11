import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateTokenAndCookie } from "../lib/utils/generateToken.js";

export const signup = async(req, res) => {
    try {
        const {fullname, username, password, email } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error: "Invalid email format"})
        }

        const existingUsername = await User.findOne({username :username})
        if(existingUsername){
            return res.status(400).json({error: "Username is already taken."})
        }

        const existingEmail = await User.findOne({email: email})
        if(existingEmail){
            return res.status(400).json({error: "Email is already taken."})
        }

        if(password.length < 6){
            res.status(400).json({error: "Password must be atleast 6 characters long"})
        }

        // hashing password wuth salt
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullname: fullname,
            username: username,
            password: hashedPassword,
            email: email
        })

        if(newUser){
            await newUser.save()
            generateTokenAndCookie(newUser._id, res)

            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
				following: newUser.following,
				profileImg: newUser.profileImg,
				coverImg: newUser.coverImg,
            })
        }
        else res.status(400).json({error: "Invalid user data."})

    } catch (error) {
        console.log(`Error signing up: ${error.message}`)
        res.status(500).json({error: "Internal Server error"})
    }   
}

export const login = async(req, res) => {
    try {
        const {username, password} = req.body

        const user = await User.findOne({username: username})
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
        if(!user || !isPasswordCorrect){
            res.status(400).json({error: "Incorrect username or password."})
        }

        generateTokenAndCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			email: user.email,
			followers: user.followers,
			following: user.following,
			profileImg: user.profileImg,
			coverImg: user.coverImg,
		});

    } catch (error) {
        console.log(`Error logging in: ${error.message}`)
        res.status(500).json({error: "Internal Server error"})
    }
}

export const logout = async(req, res) => {
    try {
        res.cookie("jwt", "", {maxAge : 0})
        res.status(200).json({message: "Logged out succesfully."})
    } catch (error) {
        console.log(`Error logging out: ${error.message}`)
        res.status(500).json({error: "Internal Server error"})
    }
}

export const getme = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(user)
    } catch (error) {
        console.log(`Error getting the user : ${error.message}`)
        res.status(500).json({error: "Internal Server error"})
    }
}