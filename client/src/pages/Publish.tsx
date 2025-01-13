import { useState } from "react";
import { Appbar } from "../components/Appbar";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { FaBackward, FaTrash } from "react-icons/fa";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

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
      console.error("No image URL available. Please upload an image.");
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
          {/* Title Input */}
          <input
            type="text"
            placeholder="Enter the title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-ysabeau lg:text-4xl font-semibold mb-6 px-2 py-2 border-l border-gray-500 focus:outline-none focus:border-gray-500 placeholder-gray-300"
          />

          {/* TinyMCE Editor */}
          <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
            value={content}
            onEditorChange={(newContent, editor) => {
              // Extract plain text using editor.getContent({ format: 'text' })
              const plainText = editor.getContent({ format: "text" });
              setContent(plainText);
            }}
            init={{
              height: 450,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | link image media table | emoticons charmap | removeformat",
            }}
          />

          {/* Image Upload */}
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

          {/* Uploaded Image */}
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

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-black font-quicksand bg-yellow-600 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-yellow-900 hover:bg-yellow-700"
          >
            Publish post
          </button>
        </div>
      </div>
    </div>
  );
};
