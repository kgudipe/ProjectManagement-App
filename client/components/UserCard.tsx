import React from 'react'
import { User } from '@/state/api'
import Image from 'next/image'

type Props = {
    user: User
}

const UserCard = ({ user }: Props) => {
    return (
        <div className='surface-card surface-card-hover flex items-center gap-3 p-4'>
            {user.profilePictureUrl && (
                <Image 
                    src={`https://pm-images-s3bucket.s3.us-east-1.amazonaws.com/p1.jpeg`}
                    alt='profile picture'
                    width={32}
                    height={32}
                    className='h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-dark-tertiary'/>
            )}
            <div>
                <h3 className='font-semibold text-gray-950 dark:text-white'>{user.username}</h3>
                <h3 className='text-sm text-gray-500 dark:text-gray-400'>{user.email}</h3>
            </div>
        </div>
    )
}

export default UserCard
