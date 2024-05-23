"use server";

import { revalidatePath } from "next/cache";
import Post from "../models/post.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
    text: string;
    author: string;
    communityId: string | null;
    path: string
}

export async function createPost({
    text,
    author,
    communityId,
    path
}: Params) {

    console.log('Creating post...');

    connectToDB();

    try {
        const createdPost = await Post.create({
            text,
            author,
            communityId: null,
        });

        // update user model
        await User.findByIdAndUpdate(author, {
            $push: { posts: createdPost._id }
        });

        revalidatePath(path);
    }
    catch (err: any) {
        throw new Error(`Failed to create post: ${err.message}`);
    }
}

export async function fetchPosts(pageNumber: number = 1, pageSize: number = 10) {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    try {
        const postsQuery = Post.find({ parentId: { $in: [null, undefined] } })
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({ path: 'author', model: User })
            .populate({
                path: 'children', populate: {
                    path: 'author',
                    model: User,
                    select: '_id name parentId image'
                }
            });

        const totalPostsCount = await Post.countDocuments({ parentId: { $in: [null, undefined] } });

        const posts = await postsQuery.exec();

        const isNext = totalPostsCount > skipAmount + pageSize;

        return { posts, isNext };
    }
    catch (err: any) {
        throw new Error(`Failed to fetch posts: ${err.message}`);
    }
}

export async function fetchPostById(id: string) {
    connectToDB();

    try {

        // TODO: populate community
        const post = await Post.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: '_id id name image'
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: '_id id name image'
                    },
                    {
                        path: 'children',
                        model: Post,
                        populate: {
                            path: 'author',
                            model: User,
                            select: '_id id name image'
                        }
                    }
                ],
            }).exec();

        return post;
    }
    catch (err: any) {
        throw new Error(`Failed to fetch post: ${err.message}`);
    }
}

export async function addCommentToPost(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
) {
    connectToDB();

    try {
        // Find parent post
        const parentPost = await Post.findById(threadId);

        if (!parentPost) {
            throw new Error('Parent post not found');
        }

        // Create new comment
        const newComment = new Post({
            text: commentText,
            author: userId,
            parentId: threadId
        });

        const saved = await newComment.save();

        // Update parent post
        parentPost.children.push(saved._id);

        await parentPost.save();

        revalidatePath(path);
    } catch (err: any) {
        throw new Error(`Failed to add comment: ${err.message}`);
    }
}