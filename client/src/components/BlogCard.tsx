import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiShare2 } from "react-icons/fi"; // Feather Icons
import { BiBookmark, BiBookmarkHeart } from "react-icons/bi"; // Bootstrap Icons
import axios from "axios";
import { BACKEND_URL } from "../config";
import useUserInfoStore from "../store/store"; // Import Zustand store

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: number;
  image?: string; // Optional blog image
}

export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
  image,
}: BlogCardProps) => {
  const { userInfo, setUserInfo } = useUserInfoStore();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Check if the blog is bookmarked on mount or userInfo change
  useEffect(() => {
    if (userInfo && userInfo.bookmarkedBlogs) {
      const isAlreadyBookmarked = userInfo.bookmarkedBlogs.some(
        (bookmark) => bookmark.blog.id === id
      );
      setIsBookmarked(isAlreadyBookmarked);
    }
  }, [userInfo, id]);

  const handleBookmark = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog/bookmark`,
        { blogId: id },
        {
          headers: {
            authorization: `${localStorage.getItem("token") || ""}`,
          },
        }
      );

      if (response.data.message === "Blog removed from bookmarks") {
        // Update state after unbookmarking
        setIsBookmarked(false);
        const updatedBookmarkedBlogs =
          userInfo?.bookmarkedBlogs.filter(
            (bookmark) => bookmark.blog.id !== id
          ) || [];
        updateUserInfo(updatedBookmarkedBlogs);
      } else if (response.data.message === "Blog added to bookmarks") {
        // Update state after bookmarking
        setIsBookmarked(true);
        const newBlog = {
          blog: {
            id,
            title,
            content,
            image,
            published: true,
            createdAt: publishedDate,
            author: { name: authorName },
          },
        };
        const updatedBookmarkedBlogs = [
          ...(userInfo?.bookmarkedBlogs || []),
          newBlog,
        ];
        updateUserInfo(updatedBookmarkedBlogs);
      }
    } catch (error) {
      console.error("Error bookmarking/unbookmarking:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const updateUserInfo = (updatedBookmarkedBlogs: any[]) => {
    const updatedUserInfo = {
      ...userInfo,
      bookmarkedBlogs: updatedBookmarkedBlogs,
    };
    setUserInfo(updatedUserInfo);
    localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: `${content.slice(0, 50)}...`,
        url: `${window.location.origin}/blog/${id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/blog/${id}`);
      alert("Blog link copied to clipboard!");
    }
  };

  // Truncate the content for preview
  const truncatedContent =
    content.length > 100 ? content.slice(0, 30) + "..." : content;

  return (
    <div className="relative mt-8 mx-auto w-full max-w-screen-sm bg-white rounded-xl shadow-md hover:shadow-xl transform transition-transform duration-300 hover:-translate-y-1">
      <Link to={`/blog/${id}`} className="flex flex-col sm:flex-row">
        <div className="p-6 flex flex-col justify-between gap-3 sm:w-2/3 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none">
          <div className="flex items-center text-sm text-gray-600">
            <Avatar name={authorName} />
            <span className="ml-2 font-medium font-ysabeau">{authorName}</span>
            <div className="h-1 w-1 mx-2 bg-gray-400 rounded-full"></div>
            <span>{publishedDate}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 font-quicksand truncate">
            {title}
          </h2>
          {/* Render truncated content */}
          <p
            className="mt-2 text-gray-600 font-quicksand overflow-hidden text-ellipsis whitespace-nowrap"
            dangerouslySetInnerHTML={{ __html: truncatedContent }}
          />
        </div>
        {image && (
          <div className="w-full sm:w-1/3 h-40 p-6 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </Link>
      <div className="px-6 py-4 flex items-center justify-between bg-white rounded-b-xl">
        <button
          onClick={handleShare}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <FiShare2 className="mr-1 text-lg" />
          <span className="text-sm font-medium">Share</span>
        </button>
        <button
          onClick={handleBookmark}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          {isBookmarked ? (
            <BiBookmarkHeart className="mr-1 text-lg text-yellow-500" />
          ) : (
            <BiBookmark className="mr-1 text-lg" />
          )}
          <span className="text-sm font-medium">
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </span>
        </button>
      </div>
    </div>
  );
};

export const Avatar = ({
  name,
  size = "small",
}: {
  name: string;
  size?: "small" | "big" | "huge";
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden bg-yellow-600 rounded-full ${
        size === "small"
          ? "w-6 h-6"
          : size === "big"
          ? "w-10 h-10"
          : "w-32 h-32"
      }`}
    >
      <span
        className={`${
          size === "small"
            ? "text-xs font-quicksand"
            : size === "big"
            ? "text-lg font-quicksand"
            : "text-5xl font-quicksand"
        } font-extralight text-white`}
      >
        {name[0].toUpperCase()}
      </span>
    </div>
  );
};

export function Circle() {
  return <div className="h-1 w-1 rounded-full bg-slate-500"></div>;
}
