import { fetchPosts, hasLikedPost } from "@/lib/actions/post.actions";
import { currentUser } from "@clerk/nextjs/server";
import PostCard from "@/components/cards/PostCard";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import NewPostForms from "@/components/forms/NewPostForms";

// TODO:
// - [] Implement a search bar
// - [] Implement a search bar for communities
// - [] Implement suggested communities
// - [] Implement suggested users
// - [] Implement visible latest replies
// - [] Implement likes
// - [] Implement infinite scrolling
// - [] Implement post images

export default async function Home() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchPosts(1, 30);

  console.log(`user id: ${userInfo._id} currentuser: ${user.id}`);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section>
        {/* create post*/}
        <NewPostForms currentUserId={user.id} userId={userInfo._id} imgUrl={userInfo.image} />
      </section>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No posts found</p>
        ) : (
          <>
            {result.posts.map(async (post) => {
              const isLiked = await hasLikedPost(user.id, post._id);

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
                  isLiked={isLiked}
                />
              )
            })}
          </>
        )}
      </section>
    </>
  );
}
