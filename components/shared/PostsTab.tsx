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

    if(accountType === 'User') {
        result = await fetchUserPosts(accountId);
    } else {    
        result = await fetchCommunityPosts(accountId);
    }

    if (!result) redirect('/');

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

                />
            ))}
        </section>
    )
}

export default PostsTab;