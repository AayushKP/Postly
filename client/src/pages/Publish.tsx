import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import {
  FaBackward,
  FaTrash,
  FaStar,
  FaSyncAlt,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useUserInfoStore from "../store/store";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiTitle, setAiTitle] = useState("");
  //@ts-ignore
  const [aiContent, setAiContent] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useUserInfoStore();
  const isLightMode = theme === "white";

  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
  const model = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
    apiKey: apiKey,
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setImageLoading(true);
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          formData
        );
        setImageUrl(response.data.secure_url);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
      } finally {
        setImageLoading(false);
      }
    }
  };

  const handlePublish = async () => {
    if (!imageUrl) {
      alert("No image URL available. Please upload an image.");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        { title, content, image: imageUrl },
        { headers: { authorization: localStorage.getItem("token") || "" } }
      );
      navigate(`/blog/${response.data.id}`);
    } catch (error) {
      console.error("Error publishing the blog:", error);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const generateAiContent = async () => {
    if (!aiTitle) {
      alert("Please enter a title for your blog.");
      return;
    }

    setLoading(true);
    setAiContent("");

    try {
      const systemTemplate = `Generate a blog on the topic: ${aiTitle}, headings in ALL CAPS, and proper structure. Use special characters like "*" or "=" for emphasis. Avoid HTML tags.`;
      const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", systemTemplate],
        ["user", "{text}"],
      ]);

      const promptValue = await promptTemplate.invoke({ text: aiTitle });
      const response: any = await model.invoke(promptValue);

      const formattedContent = formatMarkdownContent(response?.text);
      setAiContent(formattedContent);
      setContent(formattedContent);
      closeModal();
    } catch (error) {
      setAiContent("Error generating blog content. Please try again.");
      setContent("Error generating blog content.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatMarkdownContent = (content: string) => {
    let formattedContent = content
      .replace(/(#+) (.*?)\n/g, (p1, p2) => {
        const level = p1.length;
        return `<h${level}>${p2}</h${level}>`;
      })
      .replace(/\*\*([^\*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^\*]+)\*/g, "<em>$1</em>")
      .replace(/^[-*] (.*)/gm, "<ul><li>$1</li></ul>")
      .replace(/^\d+\. (.*)/gm, "<ol><li>$1</li></ol>")
      .replace(/\n{2,}/g, "\n")
      .replace(/\n/g, "</p>\n<p>");

    return `<p>${formattedContent}</p>`;
  };

  return (
    <div
      className={`min-h-screen ${
        isLightMode
          ? "bg-gradient-to-b from-white to-amber-50 text-gray-900"
          : "bg-gradient-to-b from-black via-gray-800 to-[#0a1e2e] text-gray-100"
      } font-ysabeau`}
    >
      <button
        onClick={() => navigate(-1)}
        className={`absolute top-8 left-2 lg:top-8 lg:left-16 ${
          isLightMode ? "text-amber-600" : "text-blue-400"
        } font-bold text-lg lg:text-2xl`}
      >
        <FaBackward />
      </button>

      <div className="flex justify-center w-full pt-8 px-10 lg:px-32">
        <div className="max-w-screen-lg w-full relative">
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Enter the title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full text-3xl lg:text-4xl font-semibold px-2 py-2 border-l ${
                isLightMode ? "border-gray-300" : "border-gray-600"
              } focus:outline-none ${
                isLightMode ? "placeholder-gray-400" : "placeholder-gray-500"
              } ${
                isLightMode
                  ? "text-gray-900 bg-white/50"
                  : "text-gray-100 bg-gray-800/50"
              } rounded-r-lg`}
            />
            <button
              onClick={handlePublish}
              className={`ml-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center ${
                isLightMode ? "text-gray-900" : "text-gray-900"
              } bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-lg shadow-lg transition-all`}
            >
              Publish
            </button>
          </div>

          <div
            className={`rounded-lg ${
              isLightMode
                ? "bg-white/90 border border-gray-200"
                : "bg-gray-800/90 border border-gray-600"
            } mb-8 overflow-hidden backdrop-blur-sm`}
          >
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["bold", "italic", "underline"],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              formats={[
                "header",
                "font",
                "bold",
                "italic",
                "underline",
                "list",
                "bullet",
                "link",
                "image",
              ]}
              className="h-[400px] [&_.ql-editor]:dark:!bg-gray-800/50 [&_.ql-editor]:dark:!text-white-100 [&_.ql-toolbar]:dark:!bg-gray-700/50 [&_.ql-toolbar]:dark:!text-gray-500"
              theme="snow"
            />
          </div>

          <div className="mt-10 space-y-6">
            {!imageUrl && (
              <label
                htmlFor="image-upload"
                className={`cursor-pointer flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed ${
                  isLightMode
                    ? "bg-amber-50/80 border-amber-200 hover:border-amber-400"
                    : "bg-gray-700/50 border-gray-600 hover:border-blue-400"
                } transition-colors duration-200 backdrop-blur-sm`}
              >
                {imageLoading ? (
                  <div className="flex flex-col items-center">
                    <FaSyncAlt
                      className={`animate-spin text-2xl mb-2 ${
                        isLightMode ? "text-amber-600" : "text-blue-400"
                      }`}
                    />
                    <span
                      className={
                        isLightMode ? "text-gray-600" : "text-gray-300"
                      }
                    >
                      Uploading...
                    </span>
                  </div>
                ) : (
                  <>
                    <FaCloudUploadAlt
                      className={`text-3xl mb-2 ${
                        isLightMode ? "text-amber-500" : "text-blue-400"
                      }`}
                    />
                    <div className="text-center">
                      <p
                        className={`text-sm ${
                          isLightMode ? "text-gray-600" : "text-gray-300"
                        }`}
                      >
                        Click to upload or drag and drop
                      </p>
                      <p
                        className={`text-xs ${
                          isLightMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}

            {imageUrl && (
              <div className="relative group">
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="w-full max-h-96 object-contain rounded-lg shadow-lg"
                />
                <button
                  onClick={handleRemoveImage}
                  className={`absolute top-4 right-4 p-2 rounded-full ${
                    isLightMode
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-red-700 text-gray-100 hover:bg-red-600"
                  } transition-colors duration-200 shadow-lg`}
                >
                  <FaTrash className="text-lg" />
                </button>
              </div>
            )}
          </div>

          <div
            className="mt-12 mb-16 flex items-center space-x-3 cursor-pointer group"
            onClick={openModal}
          >
            <div
              className={`flex items-center justify-center rounded-full h-16 w-16 ${
                isLightMode
                  ? "bg-amber-100 group-hover:bg-amber-200"
                  : "bg-blue-900/50 group-hover:bg-blue-900/70"
              } transition-colors duration-200`}
            >
              <FaStar
                className={`text-2xl ${
                  isLightMode ? "text-amber-600" : "text-blue-400"
                }`}
              />
            </div>
            <span
              className={`text-lg font-medium ${
                isLightMode ? "text-gray-800" : "text-gray-200"
              }`}
            >
              Write with AI
            </span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div
            className={`rounded-lg w-[80%] lg:w-[400px] p-6 relative ${
              isLightMode ? "bg-white/95" : "bg-gray-800/95"
            } backdrop-blur-sm`}
          >
            <button
              onClick={closeModal}
              className={`absolute top-4 right-4 text-xl ${
                isLightMode
                  ? "text-gray-600 hover:text-gray-800"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              &times;
            </button>
            <h2
              className={`text-2xl font-semibold mb-4 ${
                isLightMode ? "text-gray-800" : "text-gray-100"
              }`}
            >
              Write with AI ✨
            </h2>

            <input
              type="text"
              placeholder="Enter title for your blog"
              value={aiTitle}
              onChange={(e) => setAiTitle(e.target.value)}
              className={`w-full mb-4 p-2 rounded-lg ${
                isLightMode
                  ? "bg-white border border-gray-300 focus:border-amber-500"
                  : "bg-gray-700 border border-gray-600 focus:border-blue-400 text-gray-100"
              }`}
            />
            <button
              onClick={generateAiContent}
              className={`w-full py-2.5 rounded-lg ${
                isLightMode
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-gray-900 hover:from-blue-600 hover:to-blue-700"
              } transition-colors duration-200 shadow-lg`}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <FaSyncAlt className="animate-spin mr-2" />
                  Generating...
                </div>
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
