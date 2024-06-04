"use client";

import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'

type Props = {
    isLiked: boolean,
    postId: string,
    userId: string
}

export default function LikeButton({
    isLiked,
    postId,
    userId
}: Props) {
    const onClick = async () => {
        console.log('like post');
    }
    
    return (
        <div onClick={onClick} className='hover:bg-black'>
            <Image src={`${isLiked ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg"}`}
                alt="heart" width={24} height={24}
                className="cursor-pointer object-contain" />
        </div>
    )
}