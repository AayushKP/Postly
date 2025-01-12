import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

// Interface for Blog data, including optional image field
export interface Blog {
  content: string;
  title: string;
  id: number;
  image?: string; // Optional image field
  author: {
    name: string;
  };
}

// Custom hook to fetch a single blog by ID
export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null); // Ensure blog starts as null

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
          headers: {
            authorization: `${localStorage.getItem("token") || ""}`, // Make sure to handle empty token
          },
        });
        setBlog(response.data.blog); // Assuming the backend sends blog data in `response.data.blog`
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the blog:", error);
        setLoading(false); // Stop loading even on error
      }
    };

    fetchBlog();
  }, [id]); // Fetch when the ID changes

  return {
    loading,
    blog,
  };
};

// Custom hook to fetch all blogs
export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
          headers: {
            authorization: `${localStorage.getItem("token") || ""}`, // Handle token properly
          },
        });
        setBlogs(response.data.blogs); // Assuming backend sends blogs in `response.data.blogs`
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false); // Stop loading even on error
      }
    };

    fetchBlogs();
  }, []); // Fetch once when the component mounts

  return {
    loading,
    blogs,
  };
};
