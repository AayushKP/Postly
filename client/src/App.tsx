import { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import useUserInfoStore from "./store/store";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Blog } from "./pages/Blog";
import { Blogs } from "./pages/Blogs";
import { Publish } from "./pages/Publish";
import Home from "./pages/Home";
import { BACKEND_URL } from "./config";
import { Spinner } from "./components/Spinner"; // Spinner with Tailwind CSS
import { ProfilePage } from "./pages/Profile";

// Higher-Order Component for Private Routes
const PrivateRoute = ({
  userInfo,
  children,
}: {
  userInfo: any;
  children: JSX.Element;
}) => {
  return userInfo ? children : <Navigate to="/signin" replace />;
};

// Higher-Order Component for Auth Routes
const AuthRoute = ({
  userInfo,
  children,
}: {
  userInfo: any;
  children: JSX.Element;
}) => {
  return userInfo ? <Navigate to="/blogs" replace /> : children;
};

function App() {
  const { userInfo, setUserInfo, clearUserInfo } = useUserInfoStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      clearUserInfo();
      setLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/user/user-info`,
          {
            headers: {
              authorization: `${token}`,
            },
          }
        );

        if (response.status === 200) {
          setUserInfo(response.data);
          localStorage.setItem("userInfo", JSON.stringify(response.data));
          console.log(userInfo);
        } else {
          clearUserInfo();
        }
      } catch (error) {
        console.error("Error restoring session:", error);
        clearUserInfo();
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [setUserInfo, clearUserInfo]);

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } else {
      localStorage.removeItem("userInfo");
    }
  }, [userInfo]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Auth Routes */}
      <Route
        path="/signup"
        element={
          <AuthRoute userInfo={userInfo}>
            <Signup />
          </AuthRoute>
        }
      />
      <Route
        path="/signin"
        element={
          <AuthRoute userInfo={userInfo}>
            <Signin />
          </AuthRoute>
        }
      />

      {/* Private Routes */}
      <Route
        path="/blogs"
        element={
          <PrivateRoute userInfo={userInfo}>
            <Blogs />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute userInfo={userInfo}>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/blog/:id"
        element={
          <PrivateRoute userInfo={userInfo}>
            <Blog />
          </PrivateRoute>
        }
      />
      <Route
        path="/publish"
        element={
          <PrivateRoute userInfo={userInfo}>
            <Publish />
          </PrivateRoute>
        }
      />

      {/* Default Fallback Routes */}
      <Route
        path="*"
        element={
          userInfo ? (
            <Navigate to="/blogs" replace />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
