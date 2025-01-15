import { SigninInput } from "@kashyaap-tech/medium-common";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";
import useUserInfoStore from "../store/store";

export const Signin = () => {
  const [inputs, setInputs] = useState<SigninInput>({
    username: "",
    password: "",
  });
  const [isLightMode, setIsLightMode] = useState<boolean>(true);
  const navigate = useNavigate();
  const { setUserInfo } = useUserInfoStore();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsLightMode(savedTheme === "light" || savedTheme === null);
  }, []);

  const handleThemeToggle = () => {
    setIsLightMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "light" : "dark");
      return newMode;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputs.username.trim() || !inputs.password.trim()) {
      alert("Please fill in both Username and Password.");
      return;
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/user/signin`,
        {
          username: inputs.username,
          password: inputs.password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Signin Response:", res);
      if (res.status !== 200) {
        alert(
          `Signin failed! ${res.data.message || "Unknown error occurred."}`
        );
        return;
      }
      setUserInfo(res.data.user);
      localStorage.setItem("token", res.data.token);
      navigate("/blogs");
      alert("Signin successful!");
    } catch (error: any) {
      // Handle errors
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        alert(`Signin failed! ${errorMessage}`);
      } else {
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex justify-center items-center ${
        isLightMode ? "bg-gray-100 text-gray-900" : "bg-gray-900 text-white"
      }`}
    >
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-3xl font-semibold ${
              isLightMode ? "text-yellow-600" : "text-yellow-500"
            }`}
          >
            Sign In
          </h2>
          <button
            onClick={handleThemeToggle}
            className={`p-3 rounded-full text-sm transition ${
              isLightMode
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-white text-gray-900 hover:bg-white/80"
            }`}
          >
            {isLightMode ? "🌙" : "☀️"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-lg font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Entr your email"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                isLightMode
                  ? "border-gray-300 focus:ring-yellow-500"
                  : "border-gray-600 focus:ring-yellow-500"
              }`}
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                isLightMode
                  ? "border-gray-300 focus:ring-yellow-500"
                  : "border-gray-600 focus:ring-yellow-500"
              }`}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg transition ${
              isLightMode
                ? "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                : "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
            }`}
          >
            Sign In
          </button>
        </form>

        {/* Navigate Buttons */}
        <div className="text-center mt-6 space-y-4">
          <p>
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className={`font-medium underline transition ${
                isLightMode
                  ? "text-yellow-600 hover:text-yellow-700"
                  : "text-yellow-500 hover:text-yellow-400"
              }`}
            >
              Sign Up
            </button>
          </p>
          <button
            onClick={() => navigate("/")}
            className={`font-medium underline transition ${
              isLightMode
                ? "text-yellow-600 hover:text-yellow-700"
                : "text-yellow-500 hover:text-yellow-400"
            }`}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
