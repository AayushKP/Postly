import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Blog } from "./pages/Blog";
import { Blogs } from "./pages/Blogs";
import { Publish } from "./pages/Publish";
import Home from "./pages/Home";

function App() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Fetch user info from the /user-info endpoint using axios
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("/user-info", {
          withCredentials: true, // Allow cookies to be sent with the request
        });

        if (response.status === 200) {
          setUserInfo(response.data); // Store user info in state
        } else {
          setUserInfo(null); // If no user info, set to null
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo(null); // If error, assume no user info
      }
    };

    fetchUserInfo();
  }, []);

  if (userInfo === null) {
    // Redirect to home page if user info is not available
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/publish" element={<Publish />} />

        <Route path="*" element={<Navigate to="/blogs" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
