import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { BiSolidChat } from "react-icons/bi";
import { DataContext } from "../../context/DataProvider";

const Sidebar = ({ setAuth }) => {
	const {setAccount, account} = useContext(DataContext)
	const navigate = useNavigate();

	

	// Handle logout
	const handleLogout = async () => {
		try {
			const res = await fetch("/api/auth/logout", {
				method: "POST",
			});
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Logout failed");
			}

			// Clear user data and redirect to login
			const fetchAuthUser = async () => {
				try {
					const res = await fetch("/api/auth/me");
					const data = await res.json();
					
					if (data.error) {
						setAuth(false)
						setAccount({fullname:"", username:"", _id:"", profileImg:""})
						return
					}
					if (!res.ok) {
						throw new Error(data.error || "Something went wrong");
					}
					console.log("authUser is here:", data);
				} catch (error) {
					console.error(error);
				}
			};
	
			fetchAuthUser();
			alert("Logged out successfully");
			navigate("/login");
		} catch (error) {
			console.error(error);
			alert("Logout failed");
		}
	};

	return (
		<div className='md:flex-[2_2_0] w-18 max-w-52 bg-[#31313f] pl-10 items-center'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
				<Link to='/' className='flex justify-center md:justify-start'>
				<h2 className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900 hidden md:block text-4xl font-extrabold text-secondary mt-3'>DevHub</h2>
					<h2 className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900 md:hidden font-extrabold text-secondary mt-3'>DH</h2>
				</Link>
				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-3 items-center hover:bg-accent transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-8 h-8' />
							<span className='text-lg hidden md:block'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-3 items-center hover:bg-accent transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${account?.username}`}
							className='flex gap-3 items-center hover:bg-accent transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6 ' />
							<span className='text-lg hidden md:block '>Profile</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={"/chat"}
							className='flex gap-3 items-center hover:bg-accent transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<BiSolidChat className='w-6 h-6' />
							<span className='text-lg hidden md:block '>Chat Rooms</span>
						</Link>
					</li>
				</ul>
				{account && (
					<Link
						to={`/profile/${account.username}`}
						className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'
					>
						<div className='avatar hidden md:inline-flex'>
							<div className='w-8 rounded-full'>
								<img src={account?.profileImg || "/avatar-placeholder.png"} alt="Profile" />
							</div>
						</div>
						<div className='flex justify-between flex-1'>
							<div className='hidden md:block'>
								<p className='text-white font-bold text-sm w-20 truncate'>{account?.fullName}</p>
								<p className='text-slate-500 text-sm'>@{account?.username}</p>
							</div>
							<BiLogOut
								className='w-5 h-5 cursor-pointer'
								onClick={(e) => {
									e.preventDefault();
									handleLogout();
								}}
							/>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};

export default Sidebar;
