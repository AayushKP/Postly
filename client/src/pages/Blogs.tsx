import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton, PopularPostSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";

export const Blogs = () => {
  const { loading, blogs, error } = useBlogs();

  if (loading) {
    return (
      <div className="overflow-x-hidden">
        <Appbar />
        <div className="flex flex-row px-4 sm:px-6 lg:px-16 xl:px-32 space-x-12 mx-auto max-w-screen-xl">
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Add space between skeletons like the actual blog cards */}
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </div>

          {/* Right-side tab hidden on small screens */}
          <div className="hidden mt-8 lg:block lg:w-1/3 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Popular Posts</h2>
              <div className="mt-8 space-y-4">
                <PopularPostSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-x-hidden">
        <Appbar />
        <div className="text-center text-red-500 mt-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <Appbar />
      <div className="flex flex-row px-4 sm:px-6 lg:px-16 xl:px-24 space-x-6 mx-auto max-w-screen-xl">
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
            />
          ))}
        </div>

        {/* Right-side tab hidden on small screens */}
        <div className="hidden lg:block mt-8 lg:w-1/3 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Popular Posts</h2>
            <div className="mt-4 space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-4">
                <h3 className="font-medium">Post 1: Ysabeau</h3>
                <p className="text-sm text-gray-500">
                  Lorem ipsum dolor sit amet...
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-4">
                <h3 className="font-medium">Post 2: Ysabeau</h3>
                <p className="text-sm text-gray-500">
                  Lorem ipsum dolor sit amet...
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-4">
                <h3 className="font-medium">Post 3: Ysabeau</h3>
                <p className="text-sm text-gray-500">
                  Lorem ipsum dolor sit amet...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

