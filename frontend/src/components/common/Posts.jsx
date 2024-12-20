import { useState, useEffect } from "react";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

const Posts = ({ feedType, username, userId }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/post/all";
      case "following":
        return "/api/post/following";
      case "posts":
        return `/api/post/user/${username}`;
      case "likes":
        return `/api/post/like/${userId}`;
      default:
        return "/api/post/all";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null); 
    try {
      const res = await fetch(POST_ENDPOINT);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch posts");
      }

      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [feedType, username]);

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && error && (
        <p className="text-center text-red-500 my-4">Error: {error}</p>
      )}
      {!isLoading && !error && posts.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !error && posts.length > 0 && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} fetchPosts={fetchPosts} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
