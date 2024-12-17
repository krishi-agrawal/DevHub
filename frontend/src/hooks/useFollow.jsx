import { useState } from "react";
import toast from "react-hot-toast";

const useFollow = () => {
  const [isPending, setIsPending] = useState(false);

  const follow = async (userId) => {
    setIsPending(true);
    try {
      const res = await fetch(`/api/user/follow/${userId}`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong!");
      }

      toast.success("Followed successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return { follow, isPending };
};

export default useFollow;
