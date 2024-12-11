import mongoose, { mongo } from "mongoose";

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String
    },
    image: {
        type: String
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            text: {
                type:String,
                required: true
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        }
    ]
}, {timestamps: true})

const Post = mongoose.model("Post", postSchema) 
export default Post

// The variable Post represents the model.
// You use this variable to interact with the posts collection in MongoDB.

// Arguments:
// Name of the Model: "Post"
// This is the name of the model you are defining.
// Mongoose automatically converts this to a collection name by pluralizing it. For example:
// "Post" → posts collection in MongoDB.

// likes: array of user _ids
// comments: array of objects where one part is text and another is user _id

// "likes": ["64a37ecf1e29b3419c9ab0f5", "64a37ecf1e29b3419c9ab123"]

// "comments": [
//   {
//     "text": "This is a great post!",
//     "user": "64a37ecf1e29b3419c9ab0f5"
//   },
//   {
//     "text": "Nice picture!",
//     "user": "64a37ecf1e29b3419c9ab123"
//   }
// ]
