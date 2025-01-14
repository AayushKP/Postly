import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [isLightMode, setIsLightMode] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("isWhite") === "true";
    setIsLightMode(savedTheme);
  }, []);

  const toggleTheme = (): void => {
    setIsLightMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("isWhite", newMode.toString());
      return newMode;
    });
  };

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <div
      className={`min-h-screen  ${
        isLightMode ? "bg-white text-gray-900" : "bg-gray-900 text-white"
      } font-ysabeau`}
    >
      <div className="px-10 lg:px-32">
        <nav className="py-6 flex justify-between items-center">
          <h1
            className={`text-4xl font-bold ${
              isLightMode ? "text-yellow-600" : "text-yellow-500"
            } font-ysabeau`}
          >
            Postly
          </h1>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="hover:opacity-80">
              Features
            </a>

            <button
              onClick={() => navigate("/signin")}
              className="py-2 px-4 rounded-xl text-md text-black text-center bg-yellow-500 hover:bg-yellow-600"
              aria-label="Login"
            >
              Login
            </button>
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full text-sm text-center ${
                isLightMode
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-white text-gray-900 hover:bg-white/80"
              } transition`}
            >
              {isLightMode ? "🌙" : "☀️"}
            </button>
          </div>
          {/* Hamburger Menu */}
          <button
            className="md:hidden text-3xl"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            ☰
          </button>
        </nav>

        {/* Sidebar */}
        <div
          className={`fixed top-0 w-64 left-0 h-full bg-gray-800 text-white transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 z-50 md:hidden`}
        >
          <button
            className="text-2xl absolute top-4 right-4 "
            onClick={toggleSidebar}
          >
            ✕
          </button>
          <ul className="mt-16 space-y-6 text-center">
            <li>
              <a
                href="#features"
                className="text-xl hover:opacity-80"
                onClick={toggleSidebar}
              >
                Features
              </a>
            </li>
            <li>
              <Link to="/signin">
                <button className="text-xl hover:opacity-80">Login</button>
              </Link>
            </li>

            <li>
              <button
                onClick={() => {
                  toggleTheme();
                  toggleSidebar();
                }}
                className={`p-3 rounded-full text-center w-52 ${
                  isLightMode
                    ? "bg-gray-900 text-white hover:bg-gray-500"
                    : "bg-white text-gray-900 hover:bg-white/80"
                }`}
              >
                {isLightMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
              </button>
            </li>
          </ul>
        </div>

        <section className="flex flex-col items-center gap-10 justify-center h-3/4 text-center py-12 md:py-24">
          <div>
            <h2 className="text-5xl font-bold mb-4">
              Welcome to Postly : AI-Powered Blogging
            </h2>
            <p className="text-xl mb-6">
              Generate, create, and share blogs effortlessly with the power of
              AI!
            </p>
            <a
              href="/signin"
              className={`px-6 py-3 rounded-lg text-xl transition mb-3 ${
                isLightMode
                  ? "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                  : "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
              }`}
            >
              Create Your First Post
            </a>
          </div>

          <div id="new-age-blogging" className="text-center">
            <h3
              className={`text-3xl font-bold mb-3 ${
                isLightMode ? "text-yellow-600" : "text-yellow-500"
              }`}
            >
              The New Age of Blogging
            </h3>
            <p className="text-md mb-6 font-quicksand">
              Embrace the future of content creation with AI that empowers you
              to write smarter, faster, and more creatively than ever before.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className={`py-12 text-center rounded-xl ${
            isLightMode ? "bg-gray-100 text-gray-900" : "bg-gray-800"
          }`}
        >
          <h3
            className={`text-4xl font-bold mb-6 ${
              isLightMode ? "text-yellow-600" : "text-yellow-500"
            }`}
          >
            Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
            <div className="p-8 rounded-lg bg-gray-200 text-gray-800">
              <h4 className="text-2xl font-semibold mb-4 text-center ">
                AI Generation
              </h4>
              <p className="text-md text-center font-quicksand">
                Let AI create insightful blog content in minutes. Perfect for
                busy writers or content creators.
              </p>
            </div>
            <div className="p-8 rounded-lg bg-gray-200 text-gray-800">
              <h4 className="text-2xl font-semibold mb-4">
                Customization Options
              </h4>
              <p className="text-md text-center font-quicksand">
                Easily edit and tailor your posts to match your unique style and
                audience. With a range of formatting options.
              </p>
            </div>
            <div className="p-8 rounded-lg bg-gray-200 text-gray-800">
              <h4 className="text-2xl font-semibold mb-4">Media Integration</h4>
              <p className="text-md text-center font-quicksand">
                Easily integrate relevant images, videos, and infographics into
                your blog posts to enhance their visual appeal.
              </p>
            </div>
          </div>
        </section>

        <section id="create" className="py-24 text-center">
          <h3
            className={`text-4xl font-bold mb-6 ${
              isLightMode ? "text-yellow-600" : "text-yellow-500"
            }`}
          >
            Ready to Create Your Post?
          </h3>
          <p className="text-xl mb-6">
            Start writing your blog with AI assistance, and let us help you get
            started!
          </p>
          <a
            href="/signup"
            className={`px-8 py-4 rounded-lg text-xl transition ${
              isLightMode
                ? "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                : "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
            }`}
          >
            Start Writing
          </a>
        </section>
      </div>
      {/* Footer */}
      <footer
        className={`text-center py-8 ${
          isLightMode
            ? "bg-gray-100 text-gray-700"
            : "bg-gray-800 text-gray-400"
        }`}
      >
        <p className="text-lg">&copy; 2025 Postly , All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default Home;
