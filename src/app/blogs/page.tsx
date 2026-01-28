import Link from "next/link";
import { createClient } from "../utils/supabase/server";

export default async function BlogsPage() {
  const client = await createClient();

  const { data: blogData, error: blogError } = await client
    .from("blog")
    .select("*, photoclubuser(*)");

  if (blogError) {
    return <div>Error loading blog posts.</div>;
  }
  if (blogData === null || blogData.length === 0) {
    return <div>No blog posts found.</div>;
  }

  const loggedIn = (await client.auth.getUser()).data.user !== null;

  return (
    <>
      {loggedIn && (
        <Link
          href="/blogs/new"
          className="cursor-camera py-8 text-center text-2xl font-bold transition-colors duration-500 hover:bg-gray-300"
        >
          Create New Blog Post
        </Link>
      )}

      {blogData.map((blog) => (
        <Link
          href={`/blogs/${blog.id}`}
          key={blog.id}
          className="cursor-camera transition-colors duration-500 hover:bg-gray-300"
        >
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-bold">{blog.title}</h2>
            <p className="mb-4 text-gray-600">
              Published on {new Date(blog.postdate).toLocaleDateString()} by{" "}
              {blog.photoclubuser.username}
            </p>
          </div>
        </Link>
      ))}
    </>
  );
}
