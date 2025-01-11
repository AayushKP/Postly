import { SignupInput } from "@kashyaap-tech/medium-common";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [inputs, setInputs] = useState<SignupInput>({
    name: "",
    username: "",
    password: "",
  });
  const [isLightMode, setIsLightMode] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsLightMode(savedTheme === "light" || savedTheme === null); // Default to light mode
  }, []);

  const handleThemeToggle = () => {
    setIsLightMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "light" : "dark");
      return newMode;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted", inputs);
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
            Sign Up
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
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-lg font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                isLightMode
                  ? "border-gray-300 focus:ring-yellow-500"
                  : "border-gray-600 focus:ring-yellow-500"
              }`}
              required
            />
          </div>

          {/* Username Field */}
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
            Sign Up
          </button>
        </form>

        {/* Navigate Buttons */}
        <div className="text-center mt-6 space-y-4">
          <p>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className={`font-medium underline transition ${
                isLightMode
                  ? "text-yellow-600 hover:text-yellow-700"
                  : "text-yellow-500 hover:text-yellow-400"
              }`}
            >
              Sign In
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
