import * as z from 'zod';

export const PostValidation = z.object({
    post: z.string().min(3),
    accountId: z.string(),
});

export const CommentValidation = z.object({
    message: z.string().min(3),
});