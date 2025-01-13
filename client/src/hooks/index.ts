import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

// Interface for Blog data, including the bookmark count
export interface Blog {
  id: number;
  title: string;
  content: string;
  image?: string; // Optional image field
  author: {
    name: string;
  };
  published: boolean;
  createdAt: string;
  bookmarkCount: number; 
}

// Custom hook to fetch a single blog by ID
export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null); // Ensure blog starts as null
  const [error, setError] = useState<string | null>(null); // Track errors

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
    error, // Return error state
  };
};

// Custom hook to fetch all blogs
export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]); // Array of blogs
  const [error, setError] = useState<string | null>(null); // Track errors

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
      } catch (error: any) {
        console.error("Error fetching blogs:", error);
        setError("Failed to fetch blogs. Please try again later.");
        setLoading(false); // Stop loading even on error
      }
    };

    fetchBlogs();
  }, []); // Fetch once when the component mounts

  return {
    loading,
    blogs,
    error, // Return error state
  };
};