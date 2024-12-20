import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../../context/DataProvider";
import { formatPostDate } from "../../utils/date/index";
import LoadingSpinner from "./LoadingSpinner";

const Post = ({ post, fetchPosts}) => {
	const {account} = useContext(DataContext)
	const formattedDate = formatPostDate(post.createdAt);
	const [comment, setComment] = useState("");
	const postOwner = post.user;
	const isLiked = post.likes.includes(account._id);
	
	const isMyPost = account._id == post.user._id
	
		
	const [isDelPending, setDelPending] = useState(false);
	const [isLiking, setIsLiking] = useState(false);
	const [isCommenting, setIsCommenting] = useState(false);
	const handleDeletePost = async() => {
		setDelPending(true)
		try {
			const res = await fetch(`/api/post/${post._id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
			}})
			const data = await res.json()
			console.log(data)
			if (!res.ok) {
				throw new Error(data.error || "Something went wrong");
			}
			fetchPosts()
		} catch (error) {
			console.log(error)
		} finally{
			setDelPending(false)
		}
	};

	const handlePostComment = async(e) => {
		e.preventDefault();
		setIsCommenting(true)
		try {
			const res = await fetch(`/api/post/${post._id}/comment`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					
				},
				body: JSON.stringify({text: comment})
			})
			const data = await res.json()
			console.log(data)
			if (!res.ok) {
				throw new Error(data.error || "Something went wrong");
			}
			fetchPosts()
		} catch (error) {
			console.log(error)
		} finally{
			setIsCommenting(false)
		}

	};

	const handleLikePost = async() => {
		setIsLiking(true)
		try {
			const res = await fetch(`/api/post/${post._id}/like`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
			}})
			const data = await res.json()
			console.log(data)
			if (!res.ok) {
				throw new Error(data.error || "Something went wrong");
			}
			fetchPosts()
		} catch (error) {
			console.log(error)
		} finally{
			setIsLiking(false)
		}
	};

	return (
		<>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
				<div className='avatar'>
					<Link to={`/profile/${postOwner.username}`} className='w-8 rounded-full overflow-hidden'>
						{!isMyPost && <img src={postOwner.profileImg || "/avatar-placeholder.png"} />}
						{isMyPost && <img src={account.profileImg || "/avatar-placeholder.png"} />}
					</Link>
				</div>
				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center px-4 py-3 rounded bg-[#31313f]'>
						<Link to={`/profile/${postOwner.username}`} className='font-bold'>
							{!isMyPost && postOwner.fullname}
							{isMyPost && account.fullname}
						</Link>
						<span className='flex gap-1 text-sm text-secondary'>
							<Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								<FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />
								{isDelPending && <LoadingSpinner size='sm' />}
							</span>
						)}
					</div>
					<div className='flex flex-col gap-3 overflow-hidden'>
						<span>{post.text}</span>
						{post.image && (
							<img
								src={post.image}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)}
					</div>
					<div className='flex mt-3'>
						<div className='flex gap-8 items-center w-2/3 justify-start'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{post.comments.length}
								</span>
							</div>
							{/* We're using Modal Component from DaisyUI */}
							<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{post.comments.length === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 Be the first one 😉
											</p>
										)}
										{post.comments.map((comment) => (
											<div key={comment._id} className='flex gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={comment.user.profileImg || "/avatar-placeholder.png"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{comment.user.fullName}</span>
														<span className='text-gray-700 text-sm'>
															@{comment.user.username}
														</span>
													</div>
													<div className='text-sm'>{comment.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
										{isCommenting ? <LoadingSpinner size='md' /> : "Post"}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							{/* <div className='flex gap-1 items-center group cursor-pointer'>  */}
								 {/* <BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' /> */}
								{/* <span className='text-sm text-slate-500 group-hover:text-green-500'>0</span> */}
						 	{/* </div>  */}
							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
							{isLiking && <LoadingSpinner size='sm' />}
								{!isLiked && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

								<span
									className={`text-sm text-slate-500 group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : ""
									}`}
								>
									{post.likes.length}
								</span>
							</div>
						</div>
						{/* <div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
						</div> */}
					</div>
				</div>
			</div>
		</>
	);
};
export default Post;