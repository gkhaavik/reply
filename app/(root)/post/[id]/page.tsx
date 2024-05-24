import PostCard from "@/components/cards/PostCard";
import Comment from "@/components/forms/Comment";
import { fetchPostById } from "@/lib/actions/post.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
    if (!params.id) return null;

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    const post = await fetchPostById(params.id);

    return (
        <section className="relative">
            <div>
                <PostCard
                    key={post._id}
                    id={post._id}
                    currentUserId={user?.id || ""}
                    parentId={post.parentId}
                    content={post.text}
                    author={post.author}
                    createdAt={post.createdAt}
                    comments={post.children}
                    community={post.community}
                />
            </div>

            <div className="mt-7">
                <Comment
                    postId={post.id}
                    currentUserImg={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>

            <div className="mt-10">
                {post.children.map((comment: any) => (
                    <PostCard
                        key={comment._id}
                        id={comment._id}
                        currentUserId={user?.id || ""}
                        parentId={comment.parentId}
                        content={comment.text}
                        author={comment.author}
                        createdAt={comment.createdAt}
                        comments={comment.children}
                        community={comment.community}
                        isComment
                    />
                ))}

            </div>
        </section >
    )
}

export default Page