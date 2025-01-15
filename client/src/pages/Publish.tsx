import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { FaBackward, FaTrash, FaStar, FaSyncAlt } from "react-icons/fa";
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
  const [aiContent, setAiContent] = useState("");
  const navigate = useNavigate();
  const { setUserInfo } = useUserInfoStore();

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
      }
    }
  };

  const handlePublish = async () => {
    if (!imageUrl) {
      alert("No image URL available. Please upload an image.");
      return;
    }

    try {
      // Send the HTML content directly to the backend
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        { title, content, image: imageUrl },
        { headers: { authorization: localStorage.getItem("token") || "" } }
      );
      //@ts-ignore
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        blogs: [...prevUserInfo.blogs, response.data],
      }));
      navigate(`/blog/${response.data.id}`);
    } catch (error) {
      console.error("Error publishing the blog:", error);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const generateAiContent = async () => {
    if (!aiTitle) {
      alert("Please enter a title for your blog.");
      return;
    }

    setLoading(true);
    setAiContent(""); // Clear previous content

    try {
      const systemTemplate = `Generate a blog on the topic: ${aiTitle}, headings in ALL CAPS, and proper structure. Use special characters like "*" or "=" for emphasis. Avoid HTML tags.`;
      const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", systemTemplate],
        ["user", "{text}"],
      ]);

      const promptValue = await promptTemplate.invoke({
        text: aiTitle,
      });

      const response: any = await model.invoke(promptValue);
      console.log(response);

      // Format the Markdown response with proper spacing between headings, subheadings, and paragraphs
      const formattedContent = formatMarkdownContent(response?.text);

      // Set the content in the editor as HTML to preserve formatting
      setAiContent(formattedContent);
      setContent(formattedContent); // Update TinyMCE with HTML content
      closeModal(); // Close modal after content is generated
    } catch (error) {
      setAiContent("Error generating blog content. Please try again.");
      setContent("Error generating blog content.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatMarkdownContent = (content: string) => {
    let formattedContent = content;

    // Convert markdown headings to HTML headings
    formattedContent = formattedContent.replace(
      /(#+) (.*?)\n/g,
      (match, p1, p2) => {
        const level = p1.length; // Number of "#" determines heading level
        return `<h${level}>${p2}</h${level}>`;
      }
    );

    // Convert bold (**) and italic (*) markdown to HTML
    formattedContent = formattedContent.replace(
      /\*\*([^\*]+)\*\*/g,
      "<strong>$1</strong>"
    );
    formattedContent = formattedContent.replace(/\*([^\*]+)\*/g, "<em>$1</em>");

    // Convert unordered list markdown (- or *) to <ul><li>
    formattedContent = formattedContent.replace(
      /^[-*] (.*)/gm,
      "<ul><li>$1</li></ul>"
    );

    // Convert ordered list markdown (1.) to <ol><li>
    formattedContent = formattedContent.replace(
      /^\d+\. (.*)/gm,
      "<ol><li>$1</li></ol>"
    );

    // Remove extra line breaks between paragraphs and sections
    formattedContent = formattedContent.replace(/\n{2,}/g, "\n");

    // Wrap paragraphs in <p> tags and remove excessive breaks
    formattedContent = formattedContent.replace(/\n/g, "</p>\n<p>");
    formattedContent = `<p>${formattedContent}</p>`; // Wrap the entire content in <p> tag

    return formattedContent;
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-2 lg:top-8 lg:left-16 text-yellow-600 font-bold text-lg lg:text-2xl"
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
              className="w-full text-3xl font-ysabeau lg:text-4xl font-semibold px-2 py-2 border-l border-gray-500 focus:outline-none focus:border-gray-500 placeholder-gray-300"
            />
            <button
              onClick={handlePublish}
              className="ml-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-black font-quicksand bg-yellow-600 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-yellow-900 hover:bg-yellow-700"
            >
              Publish
            </button>
          </div>

          <ReactQuill
            value={content}
            onChange={(newContent) => setContent(newContent)}
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
            style={{ height: "450px", marginBottom: "6px" }}
          />

          {!imageUrl && (
            <label
              htmlFor="image-upload"
              className="cursor-pointer mt-6 flex justify-center items-center bg-gray-100 rounded-lg w-full h-28 mx-auto mb-4 border-2 border-dashed text-gray-500 hover:bg-gray-200"
            >
              <span className="text-2xl">+</span>
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
            <div className="mt-4 relative">
              <img src={imageUrl} alt="Uploaded" className="max-w-full h-96" />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
              >
                <FaTrash />
              </button>
            </div>
          )}

          <div className="mt-6 flex items-center space-x-3" onClick={openModal}>
            <div className="flex items-center justify-center bg-gray-200 rounded-full h-16 w-16 cursor-pointer">
              <FaStar
                size={30} //@ts-ignore
                className="text-yellow-500"
              />
            </div>
            <span className="text-lg font-medium text-gray-800 font-ysabeau">
              Write with AI
            </span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-[80%] lg:w-[400px] p-4 sm:p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Write with AI ✨
            </h2>

            <input
              type="text"
              placeholder="Enter title for your blog"
              value={aiTitle}
              onChange={(e) => setAiTitle(e.target.value)}
              className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={generateAiContent}
              className="w-full py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700"
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <FaSyncAlt //@ts-ignore
                    className="animate-spin text-white mr-2"
                  />
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
