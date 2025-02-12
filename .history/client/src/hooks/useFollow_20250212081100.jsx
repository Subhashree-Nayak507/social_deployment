import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

const useFollow = () => {
	const queryClient = useQueryClient();

	const { mutate: follow, isPending } = useMutation({
		mutationFn: async (userId) => {
			try {
				const res = await axios.post(`/api/user/follow/${userId}`);
				return res.data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
		onSuccess: () => {
			Promise.all([
				queryClient.setQueryData(["suggestedUsers"], (oldData) => {
					if (!oldData) return [];
					return oldData.filter((user) => user._id !== userId);
				}),
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
			]);
            toast.success("User Followed successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return { follow, isPending };
};

export default useFollow;