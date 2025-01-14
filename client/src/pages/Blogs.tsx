import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton, PopularPostSkeleton } from "../components/BlogSkeleton";
import { Blog, useBlogs } from "../hooks";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config"; // Assuming your backend URL is set in config

export const Blogs = () => {
  const { loading, blogs, error } = useBlogs();
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [popularBlogsLoading, setPopularBlogsLoading] = useState(true);

  // Fetch popular blogs from backend on component mount
  useEffect(() => {
    const fetchPopularBlogs = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/blog/blogs/popular`,
          {
            headers: {
              authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setPopularBlogs(response.data.popularBlogs);
      } catch (error) {
        console.error("Error fetching popular blogs", error);
      } finally {
        setPopularBlogsLoading(false);
      }
    };

    fetchPopularBlogs();
  }, []);

  const truncateContent = (content: string, limit: number) => {
    return content.length > limit ? content.slice(0, limit) + "..." : content;
  };

  if (loading) {
    return (
      <div className="overflow-x-hidden ">
        <Appbar />
        <div className="flex flex-row px-4 sm:px-6 lg:px-16 xl:px-32 space-x-12 mx-auto max-w-screen-xl">
          <div className="w-full lg:w-2/3 space-y-6">
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </div>
          <div className="hidden mt-8 lg:block lg:w-1/3 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Popular Posts</h2>
              <div className="mt-8 space-y-4">
                <PopularPostSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-x-hidden">
        <Appbar />
        <div className="text-center text-red-500 mt-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden min-h-screen">
      <Appbar />
      <div className="flex flex-row px-4 sm:px-6 lg:px-16 xl:pr-24 xl:pl-16 space-x-6 mx-auto max-w-screen-xl">
        <div className="w-full lg:w-2/3 space-y-6">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              authorName={blog.author.name || "Anonymous"}
              title={blog.title}
              content={blog.content}
              publishedDate={blog.createdAt}
              image={blog.image}
            />
          ))}
        </div>

        {/* Right-side tab hidden on small screens */}
        <div className="hidden lg:block mt-8 lg:w-1/3 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Popular Posts</h2>
            <div className="mt-4 space-y-4">
              {popularBlogsLoading ? (
                <PopularPostSkeleton />
              ) : (
                popularBlogs.map((blog: Blog) => (
                  <div
                    key={blog.id}
                    className="bg-gray-100 p-4 rounded-lg shadow-sm mb-4 cursor-pointer"
                    onClick={() => {
                      // Navigate to the blog details page when clicked
                      window.location.href = `/blog/${blog.id}`;
                    }}
                  >
                    <h3 className="font-medium">{blog.title}</h3>
                    <p className="text-sm text-gray-500">
                      {truncateContent(blog.content, 30)}{" "}
                      {/* Truncate after 40 characters */}
                    </p>
                    <p className="text-xs text-gray-400">
                      {blog.author.name || "Anonymous"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
