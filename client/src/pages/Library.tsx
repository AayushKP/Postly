import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookmark, FaFileAlt, FaTrashAlt } from "react-icons/fa";
import useUserInfoStore from "../store/store";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const LibraryPage = () => {
  const { userInfo, theme } = useUserInfoStore();
  const isLightMode = theme === "white";
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"posts" | "bookmarks">("posts");
  //@ts-ignore
  const [userBlogs, setUserBlogs] = useState(userInfo?.blogs || []);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState(
    userInfo?.bookmarkedBlogs || []
  );

  useEffect(() => {
    //@ts-ignore
    setUserBlogs(userInfo?.blogs || []);
    setBookmarkedBlogs(userInfo?.bookmarkedBlogs || []);
  }, [userInfo]);

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const backendUrl = `${BACKEND_URL}/api/v1/blog/delete/${id}`;

      await axios.delete(backendUrl, {
        headers: {
          authorization: `${token}`,
        },
      });

      if (activeTab === "posts") {
        setUserBlogs((prevBlogs: any) =>
          prevBlogs.filter((blog: any) => blog.id !== id)
        );
      } else {
        setBookmarkedBlogs((prevBookmarks) =>
          prevBookmarks.filter((bookmark) => bookmark.blog.id !== id)
        );
      }

      window.alert("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      window.alert("Failed to delete blog. Please try again.");
    }
  };

  return (
    <div
      className={`h-[100dvh] ${
        isLightMode ? "bg-gray-100 text-gray-900" : "bg-gray-900 text-gray-100"
      } flex items-center justify-center relative px-4 py-8`}
    >
      <button
        onClick={() => navigate(-1)}
        className={`absolute top-6 left-6 ${
          isLightMode ? "bg-amber-500 text-white" : "bg-blue-500 text-gray-900"
        } text-xl h-10 w-10 rounded-full flex items-center justify-center`}
      >
        ←
      </button>

      <div
        className={`shadow-lg rounded-xl w-full max-w-screen-xl h-[80vh] md:w-[70vw] flex flex-col md:flex-row ${
          isLightMode ? "bg-white" : "bg-gray-800"
        }`}
      >
        <div
          className={`w-full md:w-1/4 p-4 flex flex-row md:flex-col gap-4 justify-between lg:justify-start ${
            isLightMode ? "bg-amber-100" : "bg-gray-700"
          }`}
        >
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center justify-center py-2 px-4 rounded-lg h-16 w-16 lg:w-full ${
              activeTab === "posts"
                ? "bg-amber-400 text-white"
                : "text-gray-500"
            }`}
          >
            <FaFileAlt size={24} />
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`flex items-center justify-center py-2 px-4 rounded-lg h-16 w-16 lg:w-full ${
              activeTab === "bookmarks"
                ? "bg-amber-400 text-white"
                : "text-gray-500"
            }`}
          >
            <FaBookmark size={24} />
          </button>
        </div>

        <div className="w-full md:w-3/4 p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">
            {activeTab === "posts" ? "Your Posts" : "Bookmarks"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTab === "posts" ? (
              userBlogs.length > 0 ? (
                userBlogs.map((blog: any) => (
                  <DashboardCard
                    key={blog.id}
                    id={blog.id}
                    title={blog.title || "Untitled"}
                    content={blog.content}
                    createdAt={new Date(blog.createdAt).toLocaleDateString()}
                    onClick={() => navigate(`/blog/${blog.id}`)}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <p className="text-gray-500">
                  You have not created any posts yet.
                </p>
              )
            ) : bookmarkedBlogs.length > 0 ? (
              bookmarkedBlogs.map((bookmark) => (
                <DashboardCard
                  key={bookmark.blog.id}
                  id={bookmark.blog.id}
                  title={bookmark.blog.title || "Untitled"}
                  content={bookmark.blog.content}
                  createdAt={new Date(
                    bookmark.blog.createdAt
                  ).toLocaleDateString()}
                  onClick={() => navigate(`/blog/${bookmark.blog.id}`)}
                />
              ))
            ) : (
              <p className="text-gray-500">
                You have not bookmarked any posts yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  onClick: () => void;
  onDelete?: (id: number) => void;
}

export const DashboardCard = ({
  id,
  title,
  content,
  createdAt,
  onClick,
  onDelete,
}: DashboardCardProps) => {
  return (
    <div
      className="relative shadow-md rounded-lg p-4 border transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      {onDelete && (
        <FaTrashAlt
          size={15}
          className="absolute top-2 right-2 text-red-500 hover:text-red-600 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        />
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p
        className="text-sm overflow-hidden text-ellipsis whitespace-nowrap"
        dangerouslySetInnerHTML={{
          __html: content.length > 100 ? `${content.slice(0, 40)}...` : content,
        }}
      />
      <p className="text-xs mt-4">Created on: {createdAt}</p>
    </div>
  );
};
