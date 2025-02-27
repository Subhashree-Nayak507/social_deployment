import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditProfileModal = () => {
	const queryClient = useQueryClient();

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});
	const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
		mutationFn: async () => {
			try {
				const updatedFields = {};
        
				if (formData.fullName !== authUser.user.fullName) {
				  updatedFields.fullName = formData.fullName;
				}
				if (formData.username !== authUser.user.username) {
				  updatedFields.username = formData.username;
				}
				if (formData.email !== authUser.user.email) {
				  updatedFields.email = formData.email;
				}
				if (formData.bio !== authUser.user.bio) {
				  updatedFields.bio = formData.bio;
				}
				if (formData.link !== authUser.user.link) {
				  updatedFields.link = formData.link;
				}

				if (formData.newPassword && formData.currentPassword) {
				  updatedFields.newPassword = formData.newPassword;
				  updatedFields.currentPassword = formData.currentPassword;
				}
               
				const res = await axios.post(`/api/user/updateProfileData`, updatedFields);
				return res.data.user;
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
			setFormData(prev => ({
				...prev,
				newPassword: "",
				currentPassword: "",
			  }));
			  const modal = document.getElementById("edit_profile_modal");
			  if (modal) {
				modal.close();
			  }
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	 useEffect(() => {
		if (authUser) {
		  setFormData(prevData => ({
			...prevData,
			fullName: authUser.user.fullName || "",
			username: authUser.user.username || "",
			email: authUser.user.email || "",
			bio: authUser.user.bio || "",
			link: authUser.user.link || "",
			newPassword: "",
			currentPassword: "",
		  }));
		}
	  }, [authUser]);

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile();
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						<button className='btn btn-primary rounded-full btn-sm text-white'>
							{isUpdatingProfile ? "Updating..." : "Update"}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;