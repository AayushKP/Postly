import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton, PopularPostSkeleton } from "../components/BlogSkeleton";
import { Blog, useBlogs } from "../hooks";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import useUserInfoStore from "../store/store";

export const Blogs = () => {
  const { loading, blogs, error } = useBlogs();
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [popularBlogsLoading, setPopularBlogsLoading] = useState(true);
  const { theme } = useUserInfoStore();
  const isLightMode = theme === "white";

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
      <div
        className={`overflow-x-hidden ${
          isLightMode
            ? "bg-white"
            : "bg-gradient-to-b from-black via-gray-800 to-[#0a1e2e]"
        }`}
      >
        <Appbar />
        <div className="flex flex-row px-4 sm:px-6 lg:px-16 xl:px-32 space-x-12 mx-auto max-w-screen-xl">
          <div className="w-full lg:w-2/3 space-y-6">
            <BlogSkeleton isLightMode={isLightMode} />
            <BlogSkeleton isLightMode={isLightMode} />
            <BlogSkeleton isLightMode={isLightMode} />
            <BlogSkeleton isLightMode={isLightMode} />
            <BlogSkeleton isLightMode={isLightMode} />
          </div>
          <div className="hidden mt-8 lg:block lg:w-1/3 space-y-4">
            <div
              className={`p-6 rounded-xl shadow-lg ${
                isLightMode ? "bg-white" : "bg-gray-800/80 backdrop-blur-sm"
              }`}
            >
              <h2
                className={`text-xl font-semibold ${
                  isLightMode ? "text-gray-900" : "text-blue-300"
                }`}
              >
                Popular Posts
              </h2>
              <div className="mt-8 space-y-4">
                <PopularPostSkeleton isLightMode={isLightMode} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`overflow-x-hidden ${
          isLightMode
            ? "bg-white"
            : "bg-gradient-to-b from-black via-gray-800 to-[#0a1e2e]"
        }`}
      >
        <Appbar />
        <div
          className={`text-center mt-4 ${
            isLightMode ? "text-red-500" : "text-red-400"
          }`}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-x-hidden min-h-screen ${
        isLightMode
          ? "bg-white"
          : "bg-gradient-to-b from-black via-gray-800 to-[#0a1e2e]"
      }`}
    >
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
              isLightMode={isLightMode}
            />
          ))}
        </div>

        <div className="hidden lg:block mt-8 lg:w-1/3 space-y-4">
          <div
            className={`p-6 rounded-xl shadow-lg ${
              isLightMode ? "bg-white" : "bg-gray-800/80 backdrop-blur-sm"
            }`}
          >
            <h2
              className={`text-xl font-semibold ${
                isLightMode ? "text-gray-900" : "text-blue-300"
              }`}
            >
              Popular Posts
            </h2>
            <div className="mt-4 space-y-4">
              {popularBlogsLoading ? (
                <PopularPostSkeleton isLightMode={isLightMode} />
              ) : (
                popularBlogs.map((blog: Blog) => (
                  <div
                    key={blog.id}
                    className={`p-4 rounded-xl shadow-sm mb-4 cursor-pointer transition-all hover:scale-[1.01] ${
                      isLightMode
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "bg-gray-700/60 hover:bg-gray-700/80"
                    }`}
                    onClick={() => {
                      window.location.href = `/blog/${blog.id}`;
                    }}
                  >
                    <h3
                      className={`font-medium ${
                        isLightMode ? "text-gray-900" : "text-blue-300"
                      }`}
                    >
                      {blog.title}
                    </h3>
                    <p
                      className={`text-sm mt-2 ${
                        isLightMode ? "text-gray-600" : "text-gray-300"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: truncateContent(blog.content, 30),
                      }}
                    ></p>
                    <p
                      className={`text-xs mt-2 ${
                        isLightMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
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
