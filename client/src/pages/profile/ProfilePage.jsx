import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import { POSTS } from "../../utils/db/dummy";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";
import useFollow from "../../hooks/useFollow";
import axios from "axios";
import toast from "react-hot-toast";

const ProfilePage = () => {
    const [coverImg, setCoverImg] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [feedType, setFeedType] = useState("posts");

    const coverImgRef = useRef(null);
    const profileImgRef = useRef(null);
    const { username } = useParams();
    const { follow, isPending } = useFollow();

	const queryClient = useQueryClient();

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const {
        data: user,
        isLoading,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: ["userProfile"],
        queryFn: async () => {
            try {
                const res = await axios.get(`/api/user/profile/${username}`);
                const data = await res.data;
                console.log("profile", data);

                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
    });

    const isMyProfile = authUser.user._id === user?.checkUser._id;
    const memberSinceDate = formatMemberSinceDate(user?.checkUser.createdAt);
    const amIFollowing = authUser?.user.following.includes(user?._id);
    console.log("amifollowing", amIFollowing);
    console.log("users", user);

	const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
		mutationFn: async ({ profileImg ,coverImg }) => {
			try {
                const formDataToSend = new FormData();
        
                if (profileImg?.file) {
                    formDataToSend.append("profileImg", profileImg.file);
                }
                if (coverImg?.file) {
                    formDataToSend.append("coverImg", coverImg.file);
                }
				const res = await axios.post(`/api/user/updateProfileFiles`, formDataToSend, {
					headers: { 
						"Content-Type": "multipart/form-data"
					}
				});
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
			setProfileImg(null);
			setCoverImg(null);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

    const handleImgChange = (e, state) => {
        const file = e.target.files[0];
        if  ( state === "profileImg" && profileImgRef) {
            setProfileImg({
                file: file,
                fileName: file.name,
            });
        } else {
            setCoverImg({
                file: file,
                fileName: file.name,
            });
        }
    };
   

    useEffect(() => {
        refetch();
    }, [username, refetch]);

    return (
        <>
            <div className='flex-[4_4_0] border-r border-gray-700 min-h-screen'>
                {/* HEADER */}
                {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
                {(!isLoading || !isRefetching) && !user && <p className='text-center text-lg mt-4'>User not found</p>}
                <div className='flex flex-col'>
                    {!isLoading && user && (
                        <>
                            <div className='flex gap-10 px-4 py-2 items-center'>
                                <Link to='/'>
                                    <FaArrowLeft className='w-4 h-4' />
                                </Link>
                                <div className='flex flex-col'>
                                    <p className='font-bold text-lg'>{user?.checkUser.fullName}</p>
                                    <span className='text-sm text-slate-500'>{POSTS?.length} posts</span>
                                </div>
                            </div>
                            {/* COVER IMG */}
                            <div className='relative group/cover'>
                                <img
                                    src={coverImg || user?.checkUser.coverImg || "/cover.png"}
                                    className='h-52 w-full object-cover'
                                    alt='cover image'
                                />
                                 
                                {isMyProfile && (
                                    <div
                                    className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75
                                    cursor-pointer sm:opacity-0 sm:hover:opacity-100 transition duration-200
                                    flex items-center gap-2'
                                        onClick={() => coverImgRef.current.click()}
                                    >
                                        <MdEdit className='w-5 h-5 text-white' />
                                        <span className='text-white text-sm sm:hidden'/> 
                                    </div>
                                )}

                                <input
                                    type='file'
                                    hidden
                                    ref={coverImgRef}
                                    onChange={(e) => handleImgChange(e, "coverImg")}
                                />
                                <input
                                    type='file'
                                    hidden
                                    ref={profileImgRef}
                                    onChange={(e) => handleImgChange(e, "profileImg")}
                                />
                                {/* USER AVATAR */}
                                <div className='avatar absolute -bottom-16 left-4'>
                                    <div className='w-32 rounded-full relative group/avatar'>
                                        <img src={profileImg || user?.checkUser.profileImg || "/noDp.png"} />
                                        <div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100
                                         opacity-0 cursor-pointer shadow-lg transform transition-transform hover:scale-110'>
                                            {isMyProfile && (
                                                <MdEdit
                                                    className='w-4 h-4 text-white sm:w-4 sm:h-4 '
                                                    onClick={() => profileImgRef.current.click()}
                                                />
                                            )}
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-end px-4 mt-5'>
                                {isMyProfile && <EditProfileModal />}
                                {!isMyProfile && (
                                    <button
                                        className='btn btn-outline rounded-full btn-sm'
                                        onClick={() => follow(user?.checkUser._id)}
                                    >
                                        {isPending && "Loading..."}
                                        {!isPending && amIFollowing && "Unfollow"}
                                        {!isPending && !amIFollowing && "Follow"}
                                    </button>
                                )}
                                {(coverImg || profileImg) && (
                                    <button
                                        className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
                                        onClick={async () => {
											await updateProfile({ coverImg,profileImg });
										
										}}
                                    >
                                       {isUpdatingProfile ? "Updating..." : "Update"}
                                    </button>
                                )}
                            </div>

                            <div className='flex flex-col gap-4 mt-14 px-4 '>
                                <div className='flex flex-col'>
                                    <span className='font-bold text-lg'>{user?.checkUser.fullName}</span>
                                    <span className='text-sm text-slate-500'>@{user?.checkUser.username}</span>
                                    <span className='text-sm my-1'>{user?.checkUser.bio}</span>
                                </div>

                                <div className='flex gap-2 flex-wrap'>
                                    {user?.checkUser.link && (
                                        <div className='flex gap-1 items-center'>
                                            <>
                                                <FaLink className='w-3 h-3 text-slate-500' />
                                                <a
                                                    href='/'
                                                    target='_blank'
                                                    rel='noreferrer'
                                                    className='text-sm text-blue-500 hover:underline'
                                                >
                                                    {user?.checkUser.link}
                                                </a>
                                            </>
                                        </div>
                                    )}
                                    <div className='flex gap-2 items-center'>
                                        <IoCalendarOutline className='w-4 h-4 text-slate-500' />
                                        <span className='text-sm text-slate-500'>{memberSinceDate}</span>
                                    </div>
                                </div>
                                <div className='flex gap-2'>
                                    <div className='flex gap-1 items-center'>
                                        <span className='font-bold text-xs'>{user?.checkUser.following.length}</span>
                                        <span className='text-slate-500 text-xs'>Following</span>
                                    </div>
                                    <div className='flex gap-1 items-center'>
                                        <span className='font-bold text-xs'>{user?.checkUser.followers.length}</span>
                                        <span className='text-slate-500 text-xs'>Followers</span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex w-full border-b border-gray-700 mt-4'>
                                <div
                                    className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
                                    onClick={() => setFeedType("posts")}
                                >
                                    Posts
                                    {feedType === "posts" && (
                                        <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
                                    )}
                                </div>
                                <div
                                    className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
                                    onClick={() => setFeedType("likes")}
                                >
                                    Likes
                                    {feedType === "likes" && (
                                        <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    <Posts feedType={feedType} username={username} userId={user?.checkUser._id} />
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
