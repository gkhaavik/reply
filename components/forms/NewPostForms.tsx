"use client";

import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { usePathname, useRouter } from "next/navigation";

import { PostValidation } from "@/lib/validations/post";
import { createPost } from "@/lib/actions/post.actions";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { fetchUser } from "@/lib/actions/user.actions";

interface Props {
    userId: string;
    currentUserId: string;
    imgUrl: string;
}

function NewPostForms({ userId, currentUserId, imgUrl }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const { organization } = useOrganization();

    imgUrl = organization ? organization.imageUrl : imgUrl;

    const onSubmit = async (values: z.infer<typeof PostValidation>) => {
        // make sure the user cant spam the post button
        if (!values.post) return;

        // clear the form
        form.reset();

        // create the post
        await createPost({
            text: values.post,
            author: userId,
            communityId: organization ? organization.id : null,
            path: pathname
        });
    }

    const form = useForm({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            post: "",
            accountId: userId,
        }
    });

    return (
        <div className="flex w-full flex-col rounded-xl bg-dark-2 p-7">
            <div className="flex gap-10">
                <Link href={`/profile/${currentUserId}`}
                    className="relative h-11 w-11">
                    <Image
                        src={imgUrl}
                        alt="profile image"
                        fill
                        className="cursor-pointer rounded-full"
                    />
                </Link>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex justify-start gap-10 w-full"
                    >
                        <FormField
                            control={form.control}
                            name="post"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-3 w-full">
                                    <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                        <Textarea
                                            rows={2}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="bg-primary-500">Post Thread</Button>
                    </form>
                </Form>
            </div>

            <div className="my-8 h-0.5 w-full bg-dark-3" />

            <div className="flex gap-4 justify-around">
                {/* create poll icon */}
                <Button className="bg-primary-500">Poll</Button>
                <Button className="bg-primary-500">Photo / Video</Button>
                <Button className="bg-primary-500">Mood</Button>
            </div>
        </div>

    )
}

export default NewPostForms