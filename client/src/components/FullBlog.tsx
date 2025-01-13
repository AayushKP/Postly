import { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export const FullBlog = ({ blog }: { blog: Blog }) => {
  const navigate = useNavigate(); // Use useNavigate hook

  const handleBackClick = () => {
    navigate("/blogs"); // Navigate programmatically to the "/blogs" route
  };

  return (
    <div>
      <Appbar />
      {/* Back Button */}
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

      {/* Header Image Section */}
      {blog.image && (
        <div className="relative w-full h-96">
          <img
            src={blog.image}
            alt="Blog Header"
            className="absolute top-0 left-0 w-full h-full object-cover "
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10"></div>
        </div>
      )}

      <div className="flex justify-center">
        <div className="grid grid-cols-12 px-10 w-full max-w-screen-xl pt-12">
          <div className="col-span-12 lg:col-span-8">
            {/* Title and Date */}
            <div className="text-5xl font-extrabold">{blog.title}</div>
            <div className="text-slate-500 pt-2">{blog.createdAt}</div>
            <div className="pt-4">{blog.content}</div>
          </div>
          <div className="col-span-12 lg:col-span-4 pt-8 lg:pt-0">
            {/* Author Information */}
            <div className="text-slate-600 text-lg">Author</div>
            <div className="flex w-full">
              <div className="pr-4 flex flex-col justify-center">
                <Avatar size="big" name={blog.author.name || "Anonymous"} />
              </div>
              <div>
                <div className="text-xl font-bold">
                  {blog.author.name || "Anonymous"}
                </div>
                <div className="pt-2 text-slate-500">
                  Random catch phrase about the author's ability to grab the
                  user's attention
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
