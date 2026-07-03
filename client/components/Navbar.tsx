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
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200/80 bg-white/85 px-4 py-3 backdrop-blur-xl dark:border-stroke-dark dark:bg-dark-bg/85 sm:px-6 lg:px-8">
            {/* Search Bar */}
            <div className='flex min-w-0 flex-1 items-center gap-3 sm:gap-5'>
                {!isSidebarCollapsed ? null : (
                    <button className="icon-button shrink-0" onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}>
                        <Menu className='h-5 w-5' />
                    </button>
                )}
                <div className='relative flex h-min w-full max-w-sm'>
                    <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500' />
                    <input type="search" placeholder='Search...' className='control-input pl-9' />
                </div>
            </div>

            {/* Icons */}
            <div className='flex shrink-0 items-center gap-1'>
                <button
                    onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
                    className="icon-button"
                    aria-label="Toggle theme"
                >
                    {isDarkMode ? (
                        <Sun className='h-5 w-5' />
                    ) : (
                        <Moon className='h-5 w-5' />
                    )}
                </button>
                <Link
                    href='/settings'
                    className="icon-button"
                    aria-label="Settings"
                >
                    <Settings className='h-5 w-5' />
                </Link>

                {/* Divider + user info (desktop) */}
                <div className='ml-4 hidden items-center gap-3 md:flex'>
                    <div className='h-8 w-px bg-gray-200 dark:bg-stroke-dark' />
                    <div className='flex items-center gap-3'>
                        <div className="align-center flex h-9 w-9 justify-center">
                            {!!currentUserDetails?.profilePictureUrl ? (
                                <Image
                                    src={`https://pm-images-s3bucket.s3.us-east-1.amazonaws.com/${currentUserDetails?.profilePictureUrl}`}
                                    alt={currentUserDetails?.username || "User Profile Picture"}
                                    width={100}
                                    height={50}
                                className="h-full rounded-full object-cover ring-2 ring-white dark:ring-dark-tertiary"
                            />
                        ) : (
                                <User className="h-6 w-6 self-center rounded-full text-gray-600 dark:text-gray-200" />
                            )}
                        </div>
                        <span className="max-w-32 truncate font-medium text-gray-800 dark:text-white">
                            {currentUserDetails?.username}
                        </span>
                        <button
                            className="ghost-button px-3 py-2 text-xs"
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
