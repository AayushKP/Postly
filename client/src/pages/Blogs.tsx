import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  if (loading) {
    return (
      <div>
        <Appbar />
        <div className="flex justify-evenly">
          <div>
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar />
      <div className="flex flex-row justify-evenly px-10 lg:px-32">
        <div className="">
          {blogs.map(
            (blog) => (
              console.log(blog.image),
              (
                <BlogCard
                  key={blog.id} // Add key for unique identification of each card
                  id={blog.id}
                  authorName={blog.author.name || "Anonymous"}
                  title={blog.title}
                  content={blog.content}
                  publishedDate={"2nd Feb 2024"}
                  image={blog.image} // Pass the image prop here
                />
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};
