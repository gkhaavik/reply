import PostForms from "@/components/forms/PostForms";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page() {
    const user = await currentUser();
    if (!user) return null;

    // fetch organization list created by user
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarding) redirect("/onboarding");

    return (
        <>
            <h1 className="head-text">Create Thread</h1>

            <PostForms userId={userInfo._id} />
        </>
    )
}

export default Page;