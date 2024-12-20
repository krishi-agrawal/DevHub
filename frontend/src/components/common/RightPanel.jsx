import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import useFollow from "../../hooks/useFollow"
// import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummyData.js"
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";

const RightPanel = () => {
	const isLoading = false;
	const [suggestedUsers, setSuggestedUsers] = useState([])
	const {follow, isPending} = useFollow()
	const handlerFunc = async() => {
		try {
			const res = await fetch("/api/user/suggested");
			const data = await res.json();
			setSuggestedUsers(data);
			if (!res.ok) throw new Error(data.error || "Failed to fetch users.");
		  } catch (error) {
			console.error(error.message);
		  }
	}
	useEffect(() => {
		handlerFunc();
	  }, [follow]);

	console.log("Suggested Users:", suggestedUsers);

	if (suggestedUsers?.length === 0) return <div className='md:w-64 w-0'></div>;
	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#31313f] p-4 rounded-md sticky top-2'>
				<p className='font-bold text-secondary mb-4'>Suggested Developers</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestedUsers?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullname}
										</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn btn-accent text-white  hover:opacity-90 rounded-full btn-sm'
									onClick={(e) =>{ 
										e.preventDefault()
										follow(user._id)
										}
										}
									>
										{isPending ? <LoadingSpinner size='sm' /> : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;

