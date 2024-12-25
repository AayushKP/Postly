import { Avatar } from "./BlogCard";
import { Link } from "react-router-dom";

export const Appbar = () => {
  return (
    <div className="border-b flex justify-between items-center px-10 py-2">
      <Link
        to={"/blogs"}
        className="flex flex-col justify-center items-center cursor-pointer font-bold"
      >
        <div className="flex gap-2 justify-center items-center">
          <div className="font-ysabeau text-4xl">PostLy</div>
          <div className="flex items-center">
            <img src="/postly.jpg" className="h-6 w-6" alt="" />
          </div>
        </div>
      </Link>
      <div>
        <Link to={`/publish`}>
          <button
            type="button"
            className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center "
          >
            New
          </button>
        </Link>

        <Avatar size={"big"} name="Aayush" />
      </div>
    </div>
  );
};
