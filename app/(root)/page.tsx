import { fetchPosts } from "@/lib/actions/post.actions";
import { currentUser } from "@clerk/nextjs/server";
import PostCard from "@/components/cards/PostCard";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { SignOutButton, SignedIn } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarding) redirect("/onboarding");
  
  const result = await fetchPosts(1, 30);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No posts found</p>
        ) : (
          <>
            {result.posts.map((post) => (
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
            ))}
          </>
        )}
      </section>
    </>
  );
}
