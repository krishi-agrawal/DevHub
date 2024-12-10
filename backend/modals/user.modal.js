import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname : {
        type: String,
        required: true,
        unique: true
    },
    
    username : {
        type: String,
        required: true,
        unique: true
    },
    
    password : {
        type: String,
        required: true,
        minlength: 6
    },
    
    email : {
        type: String,
        required: true,
        unique: true
    },

    followers : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],

    following : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],

    bio : {
        type: String,
        default: ""
    },

    profileImg : {
        type: String,
        default: ""
    },

    coverImg : {
        type: String,
        default: ""
    },

    links : [{
        type: String,
        default: []
    }],
    
    likedPosts : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: []
    }],
}, {timestamps: true})

const User = mongoose.model("User", userSchema)

export default User