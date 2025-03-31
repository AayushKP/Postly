import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiShare2 } from "react-icons/fi";
import { BiBookmark, BiBookmarkHeart } from "react-icons/bi";
import axios from "axios";
import { BACKEND_URL } from "../config";
import useUserInfoStore from "../store/store";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: number;
  image?: string;
  isLightMode?: boolean;
}

export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
  image,
  isLightMode = true,
}: BlogCardProps) => {
  const { userInfo, setUserInfo } = useUserInfoStore();
  const [isBookmarked, setIsBookmarked] = useState(false);

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
        `${BACKEND_URL}/api/v1/blog/blogs/bookmark`,
        { blogId: id },
        {
          headers: {
            authorization: `${localStorage.getItem("token") || ""}`,
          },
        }
      );

      let updatedBookmarkedBlogs = [...(userInfo?.bookmarkedBlogs || [])];

      if (response.data.message === "Blog removed from bookmarks") {
        updatedBookmarkedBlogs = updatedBookmarkedBlogs.filter(
          (bookmark) => bookmark.blog.id !== id
        );
        setIsBookmarked(false);
      } else if (response.data.message === "Blog bookmarked successfully") {
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
        updatedBookmarkedBlogs.push(newBlog);
        setIsBookmarked(true);
      }

      const updatedUserInfo = {
        ...userInfo,
        bookmarkedBlogs: updatedBookmarkedBlogs,
      };
      //@ts-ignore
      setUserInfo(updatedUserInfo);
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
    } catch (error) {
      console.error("Error bookmarking/unbookmarking:", error);
    }
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

  const truncatedContent =
    content.length > 100 ? content.slice(0, 30) + "..." : content;

  return (
    <div
      className={`relative mt-8 mx-auto w-full max-w-screen-sm ${
        isLightMode ? "bg-white" : "bg-gray-800"
      } rounded-xl shadow-md hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1`}
    >
      <Link to={`/blog/${id}`} className="flex flex-col sm:flex-row">
        <div className="p-6 flex flex-col justify-between gap-3 sm:w-2/3 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none">
          <div
            className={`flex items-center text-sm ${
              isLightMode ? "text-gray-600" : "text-gray-300"
            }`}
          >
            <Avatar name={authorName} />
            <span className="ml-2 font-medium font-ysabeau">{authorName}</span>
            <div
              className={`h-1 w-1 mx-2 rounded-full ${
                isLightMode ? "bg-gray-400" : "bg-gray-500"
              }`}
            ></div>
            <span>{publishedDate}</span>
          </div>
          <h2
            className={`text-2xl font-bold ${
              isLightMode ? "text-gray-800" : "text-gray-100"
            } font-quicksand truncate`}
          >
            {title}
          </h2>
          <p
            className={`mt-2 ${
              isLightMode ? "text-gray-600" : "text-gray-300"
            } font-quicksand overflow-hidden text-ellipsis whitespace-nowrap`}
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
      <div
        className={`px-6 py-4 flex items-center justify-between ${
          isLightMode ? "bg-white" : "bg-gray-800"
        } rounded-b-xl`}
      >
        <button
          onClick={handleShare}
          className={`flex items-center ${
            isLightMode
              ? "text-gray-600 hover:text-gray-800"
              : "text-gray-300 hover:text-gray-100"
          } transition-colors`}
        >
          <FiShare2 className="mr-1 text-lg" />
          <span className="text-sm font-medium">Share</span>
        </button>
        <button
          onClick={handleBookmark}
          className={`flex items-center ${
            isLightMode
              ? "text-gray-600 hover:text-gray-800"
              : "text-gray-300 hover:text-gray-100"
          } transition-colors`}
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
  const { theme } = useUserInfoStore();
  const isLightMode = theme === "white";

  return (
    <div
      className={`h-1 w-1 rounded-full ${
        isLightMode ? "bg-slate-500" : "bg-gray-400"
      }`}
    ></div>
  );
}
