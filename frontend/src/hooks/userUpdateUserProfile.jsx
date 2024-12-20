import { useCallback, useState, useContext } from "react";
import { DataContext } from "../context/DataProvider";

const useUpdateUserProfile = () => {
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [error, setError] = useState(null);
    const {setAccount} = useContext(DataContext)

    const updateProfile = useCallback(async (formData) => {
        setIsUpdatingProfile(true);
        setError(null);
        try {
            const res = await fetch(`/api/user/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
			setAccount({fullname: data.fullname, username: data.username, _id: data._id, profileImg: data.profileImg})

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            console.log("Data updated:", data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUpdatingProfile(false);
        }
    },[])

    return { updateProfile, isUpdatingProfile, error };
};

export default useUpdateUserProfile;
