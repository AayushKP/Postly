import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import rocketAnimation from "../lottie/rocket.json";
import useUserInfoStore from "../store/store"; 

function Home() {
  // Get theme and toggleTheme from the store
  const { theme, toggleTheme } = useUserInfoStore();
  const isLightMode = theme === "white";

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <div
      className={`min-h-screen ${
        isLightMode
          ? "bg-gradient-to-b from-white to-amber-50 text-gray-900"
          : "bg-gradient-to-b from-black via-gray-800 to-[#0a1e2e] text-gray-100"
      } font-ysabeau`}
    >
      <div className="px-6 lg:px-24 xl:px-32">
        <nav className="py-6 flex justify-between items-center">
          <h1
            className={`text-4xl font-bold ${
              isLightMode ? "text-amber-600" : "text-blue-400"
            }`}
          >
            Postly
          </h1>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="hover:opacity-80">
              Features
            </a>
            <button
              onClick={() => navigate("/signin")}
              className="py-2 px-4 rounded-xl text-md text-black text-center bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-lg"
              aria-label="Login"
            >
              Login
            </button>
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full text-sm text-center ${
                isLightMode
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-blue-900 text-gray-100 hover:bg-blue-800"
              } transition shadow-md`}
              aria-label="Toggle Theme"
            >
              {isLightMode ? "🌙" : "☀️"}
            </button>
          </div>
          <button
            className="md:hidden text-3xl"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            ☰
          </button>
        </nav>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div className="fixed top-0 left-0 w-64 h-full bg-blue-900/90 text-gray-100 z-50 p-6 md:hidden">
            <button
              onClick={toggleSidebar}
              className="text-3xl absolute top-4 right-4"
              aria-label="Close Sidebar"
            >
              ✕
            </button>
            <ul className="mt-16 space-y-6">
              <li>
                <a
                  href="#features"
                  onClick={toggleSidebar}
                  className="block text-lg hover:opacity-80"
                >
                  Features
                </a>
              </li>
              <li>
                <Link to="/signin" onClick={toggleSidebar}>
                  <button className="block text-lg hover:opacity-80">
                    Login
                  </button>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    toggleTheme();
                    toggleSidebar();
                  }}
                  className="block text-lg hover:opacity-80"
                >
                  {isLightMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
                </button>
              </li>
            </ul>
          </div>
        )}

        <section className="flex flex-col md:flex-row items-center justify-between pt-12 pb-24 gap-8">
          <div className="flex-1 max-w-2xl lg:max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
              Welcome to Postly:
              <br />
              AI-Powered Blogging
            </h2>
            <p className="text-lg md:text-xl mb-8">
              Generate, create, and share blogs effortlessly with the power of
              AI!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/signin"
                className="px-8 py-3 rounded-xl text-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 shadow-lg transition-all transform hover:scale-105"
              >
                Create Your First Post
              </a>
            </div>
          </div>
          <div className="flex-1 w-full max-w-xl lg:max-w-2xl mt-12 md:mt-0">
            <Lottie
              animationData={rocketAnimation}
              loop={true}
              className="w-full h-full"
            />
          </div>
        </section>

        <section
          id="features"
          className={`py-16 rounded-2xl ${
            isLightMode
              ? "bg-white/90 text-gray-900"
              : "bg-gray-800/90 text-gray-100"
          } backdrop-blur-sm shadow-2xl`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3
              className={`text-3xl md:text-4xl font-bold mb-12 text-center ${
                isLightMode ? "text-amber-600" : "text-blue-300"
              }`}
            >
              Powerful Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI Generation",
                  content:
                    "Harness advanced AI algorithms to generate high-quality blog posts in seconds.",
                  icon: "🤖",
                  highlights: [
                    "Fast content creation",
                    "SEO optimized",
                    "AI-driven insights",
                  ],
                },
                {
                  title: "Customization Options",
                  content:
                    "Easily personalize your posts with a variety of editing tools and design options.",
                  icon: "🎨",
                  highlights: [
                    "Flexible layouts",
                    "Custom styling",
                    "Rich formatting",
                  ],
                },
                {
                  title: "Media Integration",
                  content:
                    "Seamlessly integrate images, videos, and interactive media to enhance your content.",
                  icon: "📷",
                  highlights: [
                    "Image and video support",
                    "Interactive elements",
                    "Responsive design",
                  ],
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group p-8 rounded-2xl transition-all transform hover:-translate-y-2 ${
                    isLightMode
                      ? "bg-white shadow-xl hover:shadow-2xl"
                      : "bg-gray-700/50 hover:bg-gray-700/70"
                  }`}
                >
                  <div className="mb-6">
                    <div
                      className={`text-4xl mb-4 ${
                        isLightMode ? "text-amber-600" : "text-blue-300"
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <h4 className="text-2xl font-semibold mb-4">
                      {feature.title}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-300 mb-4">
                      {feature.content}
                    </p>
                    <ul className="space-y-2">
                      {feature.highlights.map((highlight, hi) => (
                        <li key={hi} className="flex items-center text-sm">
                          <svg
                            className={`w-4 h-4 mr-2 ${
                              isLightMode ? "text-amber-500" : "text-blue-300"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div
            className={`rounded-2xl p-12 ${
              isLightMode
                ? "bg-gradient-to-r from-amber-50 to-amber-100"
                : "bg-gradient-to-r from-gray-800 to-gray-700"
            } shadow-xl`}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h3
                className={`text-3xl md:text-4xl font-bold mb-6 ${
                  isLightMode ? "text-amber-600" : "text-blue-300"
                }`}
              >
                Start Your AI Writing Journey
              </h3>
              <p className="text-lg md:text-xl mb-8">
                Join thousands of creators transforming their content creation
                process
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="/signup"
                  className="px-8 py-3 rounded-xl text-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 shadow-lg transition-all transform hover:scale-105"
                >
                  Start Blogging
                </a>
                <a
                  href="#features"
                  className={`px-8 py-3 rounded-xl text-lg border-2 ${
                    isLightMode
                      ? "border-amber-500 text-amber-600 hover:bg-amber-50"
                      : "border-blue-300 text-blue-300 hover:bg-gray-800/10"
                  } transition-colors`}
                >
                  See All Features
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer
        className={`py-6 ${
          isLightMode
            ? "bg-gray-100/80 text-gray-600"
            : "bg-gray-900/80 text-gray-300"
        } backdrop-blur-sm`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">&copy; 2025 Postly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
