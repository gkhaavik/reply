import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import PostCard from "../cards/PostCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

const PostsTab = async ({
    currentUserId,
    accountId,
    accountType,
}: Props) => {
    // Fetch profile posts
    let result: any;

    if (accountType === 'User') {
        result = await fetchUserPosts(currentUserId);
    } else {
        result = await fetchCommunityPosts(currentUserId);
    }

    if (!result) redirect('/');

    console.log(`2. account id: ${accountId} current user id: ${currentUserId} account type: ${accountType}`);

    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.posts.map((post: any) => (
                <PostCard
                    key={post._id}
                    id={post._id}
                    currentUserId={currentUserId}
                    parentId={post.parentId}
                    content={post.text}
                    author={accountType === 'User' ?
                        { name: result.name, image: result.image, id: result.id } :
                        { name: post.author.name, image: post.author.image, id: post.author.id }
                    }
                    createdAt={post.createdAt}
                    comments={post.children}
                    community={post.community}
                    isLiked={post.likedBy.some((liker: any) => liker._id.toString() === accountId)}
                />
            ))}
        </section>
    )
}

export default PostsTab;