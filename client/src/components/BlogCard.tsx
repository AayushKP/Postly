import { Link } from "react-router-dom";
interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: number;
}

export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
      <div className="m-6 border-b mt-8 border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer ">
        <div className="flex mb-4">
          <Avatar name={authorName} />
          <div className="font-light font-poppins pl-2 text-sm flex justify-center flex-col text-black">
            {authorName}
          </div>
          <div className="flex justify-center flex-col pl-2 ">
            <Circle />
          </div>
          <div className="pl-2 font-thin text-slate-500 text-sm flex justify-center flex-col ">
            {publishedDate}
          </div>
        </div>
        <div className="text-3xl font-bold font-sans ">{title}</div>
        <div className="text-lg font-semibold mt-2 text-[#696868]">
          {content.slice(0, 100) + "..."}
        </div>
        <div className="text-slate-500 text-sm font-thin mt-4">
          {`${Math.ceil(content.length / 100)} minute(s) read`}
        </div>
      </div>
    </Link>
  );
};

export function Circle() {
  return <div className="h-1 w-1 rounded-full bg-slate-500"></div>;
}

export function Avatar({
  name,
  size = "small",
}: {
  name: string;
  size?: "small" | "big";
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full ${
        size === "small" ? "w-6 h-6" : "w-8 h-8"
      }`}
    >
      <span
        className={`${
          size === "small" ? "text-xs" : "text-md"
        } font-extralight text-gray-600 dark:text-gray-300`}
      >
        {name[0]}
      </span>
    </div>
  );
}
