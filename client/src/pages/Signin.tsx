import { SigninInput } from "@kashyaap-tech/medium-common";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";
import useUserInfoStore from "../store/store";

export const Signin = () => {
  const [inputs, setInputs] = useState<SigninInput>({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const { setUserInfo } = useUserInfoStore();

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
    <div className="min-h-screen flex justify-center items-center bg-gray-100 text-gray-900">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-yellow-600">Sign In</h2>
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
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-yellow-500"
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
              placeholder="Enter your password"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-yellow-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg transition bg-yellow-500 text-gray-900 hover:bg-yellow-600"
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
              className="font-medium underline transition text-yellow-600 hover:text-yellow-700"
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
  );
};
