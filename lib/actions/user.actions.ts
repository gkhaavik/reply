"use server";

import { connect } from "http2";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Post from "../models/post.model";
import path from "path";
import { FilterQuery, SortOrder } from "mongoose";


interface Params {
    userId: string;
    username: string;
    name: string;
    image: string;
    bio: string;
    path: string;
}

export async function updateUser({
    userId,
    username,
    name,
    image,
    bio,
    path }: Params): Promise<void> {
    console.log('Updating user...');

    try {
        connectToDB();

        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                image,
                bio,
                onboarding: true,
            },
            { upsert: true },
        );

        if (path === '/profile/edit') {
            revalidatePath(path);
        }
    }
    catch (err: any) {
        throw new Error(`Failed to update user: ${err.message}`);
    }
}

export async function fetchUser(userId: string) {
    try {
        connectToDB();

        const user = await User.findOne({ id: userId });

        return user;
    }
    catch (err: any) {
        throw new Error(`Failed to fetch user: ${err.message}`);
    }
}

export async function fetchUserPosts(userId: string) {
    try {
        connectToDB();

        // TODO populate community

        const posts = await User.findOne({ id: userId })
            .populate({
                path: 'posts',
                model: Post,
                populate: {
                    path: 'children',
                    model: Post,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'id name image',
                    }
                }
            });

        return posts;
    }
    catch (err: any) {
        throw new Error(`Failed to fetch user posts: ${err.message}`);
    }
}

export async function fetchUsers({
    userId,
    searchQuery = '',
    pageNumber = 1,
    pageSize = 20,
    sortBy = 'desc',
}: {
    userId: string;
    searchQuery?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
}) {
    try {
        connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchQuery, 'i');

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId },
        }

        if (searchQuery.trim() !== '') {
            query.$or = [
                { name: regex },
                { username: regex },
            ]
        }

        const sortOptions = { createAt: sortBy };
        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totatUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec();

        const isNext = totatUsersCount > skipAmount + users.length;

        return { users, isNext };
    }
    catch (err: any) {
        throw new Error(`Failed to fetch users: ${err.message}`);
    }
}

export async function getActivity(userId: string) {
    try {
        connectToDB();


        // Find all posts created by the user
        const userPosts = await Post.find({ author: userId });

        // Collect all child post ids aka comments created by the user
        const childPostIds = userPosts.reduce((acc, post) => {
            return acc.concat(post.children);
        }, []);

        const replies = await Post.find({
            _id: { $in: childPostIds },
            author: { $ne: userId },
        }).populate({
            path: 'author',
            model: User,
            select: 'name image _id',
        });

        return replies;
    }
    catch (err: any) {
        throw new Error(`Failed to get activity: ${err.message}`);
    }
}