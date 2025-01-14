import { Circle } from "./BlogCard";

export const BlogSkeleton = () => {
  return (
    <div
      role="status"
      className="animate-pulse space-y-6 mt-8 mx-auto w-full max-w-screen-sm bg-white rounded-xl shadow-md"
    >
      <div className="p-6 flex flex-col sm:flex-row justify-between gap-3 sm:w-2/3 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded-full w-48 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
        </div>
        <div className="flex">
          <Circle />
          <div className="pl-2 font-thin text-slate-500 text-sm flex flex-col">
            <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
      </div>

      <div className="px-6 py-4 flex items-center justify-between bg-white rounded-b-xl">
        <div className="flex items-center text-gray-600 space-x-2">
          <div className="w-6 h-6 bg-gray-300 rounded-md animate-pulse"></div>
          <div className="w-12 h-4 bg-gray-300 rounded-md animate-pulse"></div>
        </div>

        <div className="flex items-center text-gray-600 space-x-2">
          <div className="w-6 h-6 bg-gray-300 rounded-md animate-pulse"></div>
          <div className="w-12 h-4 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};


export const PopularPostSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg shadow-sm space-y-2"
          >
            <div className="h-4 bg-gray-200 rounded-full w-32"></div>
            <div className="h-2 bg-gray-200 rounded-full"></div>
          </div>
        ))}
    </div>
  );
};

