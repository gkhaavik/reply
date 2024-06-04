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

interface Props {
    userId: string;
    imgUrl: string;
}

function NewPostForms({ userId, imgUrl }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const { organization } = useOrganization();

    imgUrl = organization ? organization.imageUrl : imgUrl;

    const onSubmit = async (values: z.infer<typeof PostValidation>) => {
        await createPost({
            text: values.post,
            author: userId,
            communityId: organization ? organization.id : null,
            path: pathname
        });

        router.push("/");
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
                <Link href={`/profile/${userId}`}
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
                <Button className="bg-primary-500">Create Poll</Button>
                <Button className="bg-primary-500">Create Poll</Button>
                <Button className="bg-primary-500">Create Poll</Button>
                <Button className="bg-primary-500">Create Poll</Button>
            </div>
        </div>

    )
}

export default NewPostForms