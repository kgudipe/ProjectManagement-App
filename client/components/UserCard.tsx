import React from 'react'
import { User } from '@/state/api'
import Image from 'next/image'

type Props = {
    user: User
}

const UserCard = ({ user }: Props) => {
    return (
        <div className='flex items-center rounded border p-4 shadow'>
            {user.profilePictureUrl && (
                <Image 
                    src={`p1.jpeg`}
                    alt='profile picture'
                    width={32}
                    height={32}
                    className='rounded-full'/>
            )}
            <div>
                <h3>{user.userName}</h3>
                <h3>{user.email}</h3>
            </div>
        </div>
    )
}

export default UserCard