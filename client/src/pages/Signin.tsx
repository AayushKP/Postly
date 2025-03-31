import { SigninInput } from "@kashyaap-tech/medium-common";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";
import useUserInfoStore from "../store/store";
import { motion } from "framer-motion";

export const Signin = () => {
  const [inputs, setInputs] = useState<SigninInput>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserInfo, theme } = useUserInfoStore();
  const isLightMode = theme === "white";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.username.trim() || !inputs.password.trim()) {
      alert("Please fill in both Username and Password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/user/signin`,
        { username: inputs.username, password: inputs.password },
        { withCredentials: true }
      );
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
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        alert(`Signin failed! ${errorMessage}`);
      } else {
        alert("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center ${
        isLightMode
          ? "bg-gradient-to-b from-white to-amber-50 text-gray-900"
          : "bg-gradient-to-b from-black via-gray-800 to-[#0a1e2e] text-gray-100"
      }`}
    >
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto">
        <div className="hidden md:flex flex-1 items-center justify-center p-8">
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 600 500"
            className="w-[500px] h-auto"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <defs>
              <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
                <stop
                  offset="0%"
                  stopColor={isLightMode ? "#ffffff" : "#1f2937"}
                />
                <stop
                  offset="100%"
                  stopColor={isLightMode ? "#cab23d" : "#111827"}
                />
              </linearGradient>

              <linearGradient
                id="textGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#f5510b" />
                <stop offset="50%" stopColor="#fb6824" />
                <stop offset="100%" stopColor="#fca24d" />
              </linearGradient>
            </defs>
            <rect
              x="0"
              y="0"
              width="600"
              height="500"
              rx="20"
              fill="url(#bgGradient)"
            />
            <g transform="translate(150,100)">
              <rect
                x="0"
                y="0"
                width="300"
                height="200"
                rx="10"
                fill={isLightMode ? "#fff" : "#1f2937"}
                stroke={isLightMode ? "#ffd563" : "#3b82f6"}
                strokeWidth="3"
              />
              <rect
                x="20"
                y="20"
                width="260"
                height="20"
                rx="3"
                fill={isLightMode ? "#dfa016" : "#3b82f6"}
              />
              <rect
                x="20"
                y="60"
                width="260"
                height="15"
                rx="3"
                fill={isLightMode ? "#e0e0ff" : "#93c5fd"}
              />
              <rect
                x="20"
                y="90"
                width="260"
                height="15"
                rx="3"
                fill={isLightMode ? "#e0e0ff" : "#93c5fd"}
              />
              <rect
                x="20"
                y="120"
                width="260"
                height="15"
                rx="3"
                fill={isLightMode ? "#e0e0ff" : "#93c5fd"}
              />
              <rect
                x="20"
                y="150"
                width="180"
                height="15"
                rx="3"
                fill={isLightMode ? "#e4d052" : "#93c5fd"}
              />
              <rect
                x="210"
                y="150"
                width="70"
                height="15"
                rx="3"
                fill={isLightMode ? "#e4d052" : "#dbc328"}
              />

              <text
                x="150"
                y="220"
                dy="30"
                textAnchor="middle"
                fontSize="24"
                fontFamily="Arial"
                fontWeight="bold"
                fill="#ffffff"
              >
                POSTLY:
                <tspan fill="url(#textGradient)">
                  {" "}
                  Create • Share • Inspire
                </tspan>
              </text>
            </g>
          </motion.svg>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div
            className={`w-full max-w-md p-8 rounded-lg shadow-lg ${
              isLightMode ? "bg-white" : "bg-gray-900"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-3xl font-semibold ${
                  isLightMode ? "text-yellow-600" : "text-blue-400"
                }`}
              >
                Sign In
              </h2>
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
                  placeholder="Enter your email"
                  value={inputs.username}
                  onChange={(e) =>
                    setInputs({ ...inputs, username: e.target.value })
                  }
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    isLightMode
                      ? "border-gray-300 focus:ring-yellow-500"
                      : "border-gray-700 bg-gray-800 text-gray-100 focus:ring-blue-800"
                  }`}
                  required
                />
              </div>
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
                  placeholder="Enter your password"
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                  }
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    isLightMode
                      ? "border-gray-300 focus:ring-yellow-500"
                      : "border-gray-700 bg-gray-800 text-gray-100 focus:ring-blue-800"
                  }`}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg transition bg-yellow-500 text-gray-900 hover:bg-yellow-600 flex justify-center items-center gap-2 ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full"
                    />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
            <div className="text-center mt-6 space-y-4">
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className={`font-medium underline transition ${
                    isLightMode
                      ? "text-yellow-600 hover:text-yellow-700"
                      : "text-blue-400 hover:text-blue-300"
                  }`}
                >
                  Sign Up
                </button>
              </p>
              <button
                onClick={() => navigate("/")}
                className="font-medium underline transition text-yellow-600 hover:text-yellow-700"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
