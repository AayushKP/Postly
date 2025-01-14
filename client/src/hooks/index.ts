import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Blog {
  id: number;
  title: string;
  content: string;
  image?: string;
  author: {
    name: string;
  };
  published: boolean;
  createdAt: string;
  bookmarkCount: number;
}

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
          headers: {
            authorization: `${localStorage.getItem("token") || ""}`,
          },
        });
        setBlog(response.data.blog);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching the blog:", error);
        setError("Failed to fetch blog. Please try again later.");
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  return {
    loading,
    blog,
    error,
  };
};

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
          headers: {
            authorization: `${localStorage.getItem("token") || ""}`,
          },
        });
        setBlogs(response.data.blogs);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching blogs:", error);
        setError("Failed to fetch blogs. Please try again later.");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return {
    loading,
    blogs,
    error,
  };
};