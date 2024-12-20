import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useContext, useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { DataContext } from "../../context/DataProvider";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const {account} = useContext(DataContext)

	const handleSubmit = async(e) => {
		e.preventDefault()
		setIsPending(true)
		setIsError(false)
		setErrorMessage("")
		try {
			const res = await fetch("api/post/create",{
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({text:text, image:img})
			})

			
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Something went wrong");
			}
			alert("Post created successfully");
			
		} catch (error) {
			setIsError(true);
			setErrorMessage(error.message);
		} finally {
			setIsPending(false);
			setImg(null);      // Clear the image state
			setText("");       // Reset the text state to an empty string
			if (imgRef.current) {
				imgRef.current.value = null; // Ensure file input is cleared
			}
		}
	}

	const imgRef = useRef(null);


	// const data = {
	// 	profileImg: "/avatars/boy1.png",
	// };

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={account.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' />
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-accent w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()}
						/>
						<BsEmojiSmileFill className='fill-accent w-5 h-5 cursor-pointer' />
					</div>
					<input type='file' hidden ref={imgRef} onChange={handleImgChange} />
					<button className='btn btn-accent rounded-full btn-sm text-white px-4'>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && <div className='text-red-500'>{errorMessage}</div>}
			</form>
		</div>
	);
};
export default CreatePost;