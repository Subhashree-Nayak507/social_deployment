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
        mutationFn: async (formData) => {
            try {
                const res = await axios.post(`/api/user/updateProfile`, 
                    {
                        fullName: formData.fullName,
                        username: formData.username,
                        email: formData.email,
                        bio: formData.bio,
                        link: formData.link,
                        newPassword: formData.newPassword || undefined,
                        currentPassword: formData.currentPassword || undefined
                    },
                    {
                        headers: { 
                            "Content-Type": "application/json"
                        }
                    }
                );
                return res.data.user;
            } catch (error) {
                throw new Error(error.response?.data?.error || error.message);
            }
        },
        onSuccess: () => {
            toast.success("Profile updated successfully");
            // Close the modal
            document.getElementById("edit_profile_modal").close();
            // Reset form
            setFormData({
                fullName: "",
                username: "",
                email: "",
                bio: "",
                link: "",
                newPassword: "",
                currentPassword: "",
            });
            // Invalidate queries
            return Promise.all([
                queryClient.invalidateQueries({ queryKey: ["authUser"] }),
                queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
            ]);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (authUser?.user) {
            setFormData({
                fullName: authUser.user.fullName || "",
                username: authUser.user.username || "",
                email: authUser.user.email || "",
                bio: authUser.user.bio || "",
                link: authUser.user.link || "",
                newPassword: "",
                currentPassword: "",
            });
        }
    }, [authUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    return (
        <>
            <button
                className="btn btn-outline rounded-full btn-sm"
                onClick={() => document.getElementById("edit_profile_modal").showModal()}
            >
                Edit profile
            </button>
            <dialog id="edit_profile_modal" className="modal">
                <div className="modal-box border rounded-md border-gray-700 shadow-md">
                    <h3 className="font-bold text-lg my-3">Update Profile</h3>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-wrap gap-2">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                                value={formData.fullName}
                                name="fullName"
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                                value={formData.username}
                                name="username"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <input
                                type="email"
                                placeholder="Email"
                                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                                value={formData.email}
                                name="email"
                                onChange={handleInputChange}
                            />
                            <textarea
                                placeholder="Bio"
                                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                                value={formData.bio}
                                name="bio"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <input
                                type="password"
                                placeholder="Current Password"
                                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                                value={formData.currentPassword}
                                name="currentPassword"
                                onChange={handleInputChange}
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                                value={formData.newPassword}
                                name="newPassword"
                                onChange={handleInputChange}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Link"
                            className="flex-1 input border border-gray-700 rounded p-2 input-md"
                            value={formData.link}
                            name="link"
                            onChange={handleInputChange}
                        />
                        <button 
                            type="submit" 
                            className="btn btn-primary rounded-full btn-sm text-white"
                            disabled={isUpdatingProfile}
                        >
                            {isUpdatingProfile ? "Updating..." : "Update"}
                        </button>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button className="outline-none">close</button>
                </form>
            </dialog>
        </>
    );
};

export default EditProfileModal;