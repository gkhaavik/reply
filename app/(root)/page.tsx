import { fetchPosts } from "@/lib/actions/post.actions";
import { currentUser } from "@clerk/nextjs/server";
import PostCard from "@/components/cards/PostCard";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import NewPostForms from "@/components/forms/NewPostForms";
import { useEffect, useState } from "react";

// TODO:
// - [] Implement a search bar
// - [] Implement a search bar for communities
// - [] Implement suggested communities
// - [] Implement suggested users
// - [] Implement visible latest replies
// - [x] Implement likes
// - [] Implement infinite scrolling
// - [] Implement post images

export default async function Home() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchPosts(1, 30);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section>
        {/* create post*/}
        <NewPostForms currentUserId={user.id} userId={JSON.stringify(userInfo._id)} imgUrl={userInfo.image} />
      </section>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No posts found</p>
        ) : (
          <>
            {result.posts.map((post) => {
              const liked = post.likedBy.some((liker: any) => liker._id.toString() === userInfo._id.toString());
              console.log(`Post: ${post._id} is liked: ${liked}`);

              return (
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
                  isLiked={liked}
                />
              )
            }
            )}
          </>
        )}
      </section>
    </>
  );
}
