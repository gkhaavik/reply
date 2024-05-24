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

interface Props {
    userId: string;
}

function PostForms({ userId }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const { organization } = useOrganization();

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
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-10 flex flex-col justify-start gap-10"
            >
                <FormField
                    control={form.control}
                    name="post"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-2">
                                Content
                            </FormLabel>
                            <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                <Textarea
                                    rows={15}
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
    )
}

export default PostForms;