import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateUserProfile = () => {
	const queryClient = useQueryClient();

	const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
		mutationFn: async (formData) => {
			try {
				const formDataToSend = new FormData();
				if (profileImg?.file) {
					formDataToSend.append("ProfileImg", img.file);
				}
				if (coverImg?.file) {
					formDataToSend.append("coverImg", img.file);
				}
				const res = await axios.post(`/api/user/profile/${username}`);
				const data = await res.data;
				console.log("profile",data);

				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
				queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
			]);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;