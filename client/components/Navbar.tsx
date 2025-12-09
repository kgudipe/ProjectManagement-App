import React from 'react'
import { Menu, Moon, Search, Settings, Sun, User } from 'lucide-react'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@/app/redux'
import { setIsDarkMode, setIsSidebarCollapsed } from '@/state'
import { useGetAuthUserQuery } from "@/state/api";
import { signOut } from "aws-amplify/auth";
import Image from 'next/image'

const Navbar = () => {
    const dispatch = useDispatch();

    const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);

    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const { data: currentUser } = useGetAuthUserQuery({});
    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    if (!currentUser) return null;
    const currentUserDetails = currentUser?.userDetails;

    return (
        <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
            {/* Search Bar */}
            <div className='flex items-center gap-8'>
                {!isSidebarCollapsed ? null : (
                    <button onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}>
                        <Menu className='h-8 w-8 dark:text-white' />
                    </button>
                )}
                <div className='relative flex h-min w-[200px]'>
                    <Search className='absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform' />
                    <input type="search" placeholder='Search...' className='w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white' />
                </div>
            </div>

            {/* Icons */}
            <div className='flex items-center'>
                <button
                    onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
                    className={isDarkMode ? `rounded p-2 dark:hover:bg-gray-700` : `rounded p-2 hover:bg-gray-100`}
                >
                    {isDarkMode ? (
                        <Sun className='h-6 w-6 cursor-pointer dark:text-white' />
                    ) : (
                        <Moon className='h-6 w-6 cursor-pointer' />
                    )}
                </button>
                <Link
                    href='/settings'
                    className={
                        isDarkMode
                            ? `h-min w-min rounded p-2 dark:hover:bg-gray-700`
                            : `h-min w-min rounded p-2 hover:bg-gray-100`
                    }
                >
                    <Settings className='h-6 w-6 cursor-pointer dark:text-white' />
                </Link>

                {/* Divider + user info (desktop) */}
                <div className='ml-4 hidden items-center gap-3 md:flex'>
                    <div className='h-8 w-px bg-gray-200 dark:bg-gray-700' />
                    <div className='flex items-center gap-3'>
                        <div className="align-center flex h-9 w-9 justify-center">
                            {!!currentUserDetails?.profilePictureUrl ? (
                                <Image
                                    src={`https://pm-images-s3bucket.s3.us-east-1.amazonaws.com/${currentUserDetails?.profilePictureUrl}`}
                                    alt={currentUserDetails?.username || "User Profile Picture"}
                                    width={100}
                                    height={50}
                                    className="h-full rounded-full object-cover"
                                />
                            ) : (
                                <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
                            )}
                        </div>
                        <span className="text-gray-800 dark:text-white">
                            {currentUserDetails?.username}
                        </span>
                        <button
                            className="rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
                            onClick={handleSignOut}
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
