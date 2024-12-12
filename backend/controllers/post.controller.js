import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  const { text } = req.body;
  let { image } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });
    if (!image && !text)
      res.status(400).json({ error: "Post should have image or text." });
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      image = uploadResponse.secure_url;
    }
    const newPost = new Post({
      user: userId,
      text: text,
      image: image,
    });
    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    console.log("Error in createPost controller: ", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
}

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const post = await Post.findById(postId);
    if (userId.toString() != post.user.toString())
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post." });

    if (post.image) {
      await cloudinary.uploader.destroy(
        post.image.split("/").pop().split(".")[0]
      );
    }

    await Post.findByIdAndDelete(postId);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost controller: ", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
}

export const commentOnPost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;
  const { text } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." })
    if (!text) return res.status(400).json({ error: "Text not provided" })
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found." })

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: { text: text, user: userId } } },
      { new: true }
    );
    // post.comments.push({text, user: userId})
    // await post.save()
    return res.status(200).json(updatedPost);
  } catch (error) {
    console.log("Error in commentOnPost controller: ", error.message)
    res.status(500).json({ error: "Internal Server error" })
  }
}

export const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found." });

    const comment = post.comments.find(
      (comment) => comment._id.toString() === commentId
    );
    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }
    if (comment.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this comment." });
    }
    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: { _id: commentId } },
    });
    await post.save();
    return res.status(200).json({ message: "Comment deleted successfully" })
  } catch (error) {
    console.log("Error in deleteComment controller: ", error.message)
    res.status(500).json({ error: "Internal Server error" })
  }
};

export const likeUnlikePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    // if(!user) return res.status(404).json({error: "User not found."})
    let post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found." });

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        userId,
        { $pull: { likedPosts: postId } },
        { new: true }
      );
    } else {
      post = await Post.findByIdAndUpdate(
        postId,
        { $push: { likes: userId } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        userId,
        { $push: { likedPosts: postId } },
        { new: true }
      );

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();
    }

    return res.status(200).json(post);
  } catch (error) {
    console.log("Error in likeunlikepost controller: ", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const getAllPosts = async (req, res) => {
  const userId = req.user._id;

  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts controller: ", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const getLikedPosts = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const likedPostsList = user.likedPosts;
    const likedPosts = await Post.find({ _id: { $in: likedPostsList } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts controller: ", error.message)
    res.status(500).json({ error: "Internal Server error" })
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" })

    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(feedPosts)
  } catch (error) {
    console.log("Error in getFollowingPosts controller: ", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getUserPosts = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ error: "User not found" });

		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

