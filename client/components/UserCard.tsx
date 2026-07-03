import React from 'react'
import { User } from '@/state/api'
import SafeImage from './SafeImage'

type Props = {
    user: User
}

const UserCard = ({ user }: Props) => {
    return (
        <div className='surface-card surface-card-hover flex items-center gap-3 p-4'>
            <SafeImage
                src={user.profilePictureUrl ? `/${user.profilePictureUrl}` : null}
                alt={user.username || "profile picture"}
                width={40}
                height={40}
                className='h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-dark-tertiary'
                fallbackLabel={user.username}
                variant="avatar"
            />
            <div>
                <h3 className='font-semibold text-gray-950 dark:text-white'>{user.username}</h3>
                <h3 className='text-sm text-gray-500 dark:text-gray-400'>{user.email}</h3>
            </div>
        </div>
    )
}

export default UserCard
