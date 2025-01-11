import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Blog } from "./pages/Blog";
import { Blogs } from "./pages/Blogs";
import { Publish } from "./pages/Publish";
import Home from "./pages/Home";
import useUserInfoStore from "./store/store"; // Import the store

// Protected Route Component
const ProtectedRoute = ({
  userInfo,
  children,
}: {
  userInfo: any;
  children: JSX.Element;
}) => {
  return userInfo ? children : <Navigate to="/" replace />;
};

function App() {
  const { userInfo, setUserInfo } = useUserInfoStore(); // Access userInfo from store

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("/user-info", {
          withCredentials: true,
        });

        if (response.status === 200) {
          setUserInfo(response.data); // Store the user info
        } else {
          setUserInfo(null); // No user info, set null
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo(null); // Set null on error
      }
    };

    fetchUserInfo();
  }, [setUserInfo]);
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        {/* Protected Routes */}
        <Route
          path="/blogs"
          element={
            <ProtectedRoute userInfo={userInfo}>
              <Blogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <ProtectedRoute userInfo={userInfo}>
              <Blog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/publish"
          element={
            <ProtectedRoute userInfo={userInfo}>
              <Publish />
            </ProtectedRoute>
          }
        />

        {/* Fallback Routes */}
        <Route
          path="*"
          element={<Navigate to={userInfo ? "/blogs" : "/"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
