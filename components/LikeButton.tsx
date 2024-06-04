"use client";

import Image from 'next/image'
import React from 'react'
import { likePost } from '@/lib/actions/post.actions';

type Props = {
    postId: string,
    userId: string,
    liked: boolean
}

export default function LikeButton({
    postId,
    userId,
    liked
}: Props) {
    const [isLiked, setIsLiked] = React.useState(liked);

    const handleLike = async () => {
        const result = await likePost(postId, userId);
        setIsLiked(result);
        console.log(`like result: ${result}`);
    }
    
    return (
        <div onClick={handleLike} className='hover:bg-black'>
            <Image src={`${isLiked ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg"}`}
                alt="heart" width={24} height={24}
                className="cursor-pointer object-contain" />
        </div>
    )
}