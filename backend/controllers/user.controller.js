import User from "../models/user.model.js"
import Notification from "../models/notification.model.js"
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";


export const getUserProfile = async(req, res) => {
   try {
    const {username} = req.params
    const user = await User.findOne({username}).select("-password")

    if(!user){
        return res.status(404).json({error: "User not found."}) //404 sttaus code used
    }
    return res.status(200).json(user)

   } catch (error) {
        console.log(`Error finding user in getUserProfile controller : ${error.message}`)
        res.status(500).json({error: "Internal Server error"})
   }
}

export const followUnfollowUser = async(req, res) => {
    const {idx} = req.params

    try {
        const modifyUser = await User.findById(idx)
        const currentUser = await User.findById(req.user._id)

        if(idx == req.user._id){
            return res.status(400).json({error: "You cannot follow/unfollow yourself."})
        } 
        if(!modifyUser || !currentUser){
            return res.status(404).json({error: "User not found."})
        }

        const isFollowing = currentUser.following.includes(idx) 
        if(isFollowing){
            // remove the follower
            await User.findByIdAndUpdate(idx, {$pull : {followers: req.user._id}})
            await User.findByIdAndUpdate(req.user._id, {$pull : {following: idx}})
            res.status(200).json({message: "User unfollowed succesfully"})
        } else{
            // add the follower
            await User.findByIdAndUpdate(idx, {$push : {followers: req.user._id}})
            await User.findByIdAndUpdate(req.user._id, {$push : {following: idx}})

            const notification = new Notification({
                type: "follow",
                from: req.user._id, 
                to: idx
            })
            await notification.save()
            res.status(200).json({message: "User followed succesfully"})
        }

    } catch (error) {
        console.log(`Error in followUnfollowUser controller : ${error.message}`)
        res.status(500).json({error: "Internal Server error"})
    }
}

export const getSuggestedDevelopers = async(req, res) => {
    try {
        const userId = req.user._id
        const devsFollowedByMe = await User.findById(userId).select("following") 
        // returns something like this:
        // {
        //     "_id": "12345",
        //     "following": ["67890", "54321", "98765"]
        // }
        
        const allDevsExceptCurrent = await User.find({ _id: { $ne: userId } })
        const filteredDevs = allDevsExceptCurrent.filter((dev) => !devsFollowedByMe.following.includes(dev._id))
        const suggestedDevs = filteredDevs.slice(0, 4)
        suggestedDevs.forEach((dev) => (dev.password = null))
        return res.status(200).json(suggestedDevs)

    } catch (error) {
        console.log("Error in getSuggestedDevelopers: ", error.message);
		res.status(500).json({ error:  "Internal Server error" });
    }
}

export const updateProfile = async(req, res) => {
    const userId = req.user._id
    const {fullname, email, username, bio, links, currentPassword, newPassword} = req.body
    let { profileImg, coverImg } = req.body;
    try {
        let user = await User.findById(userId)
        if(!user) return res.status(404).json({error: "User not found."})
        
        if((!newPassword && currentPassword) || (newPassword && !currentPassword)){
            return res.status(400).json({error: "Please provide both passwords."})    
        }
        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if(!isMatch)  return res.status(400).json({ error: "Current password is incorrect" })
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" });
            }
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword, salt)
        }

        if (Array.isArray(links)) {
            user.links = links;
        }else{
            return res.status(400).json({error: "Problem with links."})    
        }

        if(profileImg){
            if(user.profileImg){
                // https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg)
			profileImg = uploadedResponse.secure_url
        }
        if(coverImg){
           if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0])
           }
           const uploadedResponse = await cloudinary.uploader.upload(coverImg)
           coverImg = uploadedResponse.secure_url
        }

        user.fullname = fullname || user.fullname;
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

        user = await user.save()
        user.password = null
        return res.status(200).json(user)

    } catch (error) {
        console.log("Error in updateProfile: ", error.message);
		res.status(500).json({ error:  "Internal Server error" });
    }

} 