import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { DataContext } from "../../../context/DataProvider"


const LoginPage = ({ setAuth }) => {
	const {setAccount} = useContext(DataContext)
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsPending(true);
		setIsError(false);
		setErrorMessage("");

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await res.json();
			console.log(data)

			if (!res.ok) {
				throw new Error(data.error || "Something went wrong");
			}

			// Navigate to the homepage after successful login
			setAccount({fullname: data.fullname, username: data.username, _id: data._id})
			// console.log(account)
			setAuth(true)
			navigate("/");
		} catch (error) {
			setIsError(true);
			setErrorMessage(error.message);
		} finally {
			setIsPending(false);
		}
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center justify-center'>
				<img  src="./vectors/vector2.png" className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<img  src="./vectors/vector2.png" className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='Username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white' disabled={isPending}>
						{isPending ? "Loading..." : "Login"}
					</button>
					{isError && <p className='text-red-500'>{errorMessage}</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
