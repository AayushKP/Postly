import { Appbar } from "../components/Appbar";
import { FullBlog } from "../components/FullBlog";
import { Spinner } from "../components/Spinner";
import { useBlog } from "../hooks";
import { useParams } from "react-router-dom";
import useUserInfoStore from "../store/store";

export const Blog = () => {
  const { id } = useParams();
  const { loading, blog } = useBlog({
    id: id || "",
  });
  const { theme } = useUserInfoStore();
  const isLightMode = theme === "white";

  if (loading || !blog) {
    return (
      <div
        className={
          isLightMode
            ? "bg-white"
            : "bg-gradient-to-b from-black via-gray-800 to-[#0a1e2e] min-h-screen"
        }
      >
        <Appbar />
        <div className="h-screen flex flex-col justify-center">
          <div className="flex justify-center">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isLightMode
          ? "bg-white"
          : "bg-gradient-to-b from-black via-gray-800 to-[#0a1e2e] min-h-screen"
      }
    >
      <FullBlog blog={blog} />
    </div>
  );
};
