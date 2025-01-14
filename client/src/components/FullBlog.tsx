import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";

export const FullBlog = ({ blog }: { blog: Blog }) => {
  const navigate = useNavigate();
  const [authorBlogs, setAuthorBlogs] = useState<Blog[]>([]);
  const [noMorePosts, setNoMorePosts] = useState<boolean>(false);

  useEffect(() => {
    //@ts-ignore
    const authorId = blog.author.id;
    const fetchAuthorBlogs = async () => {
      if (authorId) {
        try {
          const response = await axios.get(
            `${BACKEND_URL}/api/v1/blog/blogs/author`,
            {
              headers: {
                authorization: `${localStorage.getItem("token")}`,
              },
              params: { authorId },
            }
          );
          if (response.data.message) {
            setNoMorePosts(true);
          } else {
            setAuthorBlogs(response.data.blogs);
          }
        } catch (error) {
          console.error("Error fetching author blogs:", error);
        }
      }
    };

    fetchAuthorBlogs();
    //@ts-ignore
  }, [blog.author.id]);

  const handleBackClick = () => {
    navigate("/blogs");
  };

  const formattedDate = new Date(blog.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="overflow-hidden">
      <Appbar />
      <button
        onClick={handleBackClick}
        className="absolute top-24 lg:top-5 left-1 lg:left-8 text-xs p-1 bg-yellow-500 text-white lg:p-2 rounded-full shadow-md hover:bg-yellow-400"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {blog.image && (
        <div className="relative w-full h-96">
          <img
            src={blog.image}
            alt="Blog Header"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10"></div>
        </div>
      )}

      <div className="flex justify-center">
        <div className="grid grid-cols-12 px-10 w-full max-w-screen-xl pt-12">
          <div className="col-span-12 lg:col-span-8">
            <div className="text-5xl font-extrabold">{blog.title}</div>
            <div className="text-slate-500 pt-2">{formattedDate}</div>
            <div className="p-4">
              <div
                className="blog-content text-left"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 pt-8 lg:pt-0">
            <div className="text-slate-600 text-lg font-semibold">
              More from Author
            </div>
            <div className="space-y-5 pt-4">
              {noMorePosts ? (
                <div>No more posts available</div>
              ) : (
                authorBlogs.map((post) => (
                  <div key={post.id} className="flex items-center space-x-4">
                    <div className="pr-2 flex flex-col justify-center">
                      <Avatar
                        size="big"
                        name={post.author.name || "Anonymous"}
                      />
                    </div>
                    <div>
                      <div
                        className="text-xl font-bold text-black font-ysabeau cursor-pointer"
                        onClick={() => navigate(`/blog/${post.id}`)}
                      >
                        {post.title}
                      </div>
                      <div className="text-sm text-slate-500">
                        {new Date(post.createdAt).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </div>
                    </div>
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
