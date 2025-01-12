import { useState } from "react";
import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null); // State to store the selected image file
  const [imageUrl, setImageUrl] = useState<string>(""); // State to store the image URL from Cloudinary
  const navigate = useNavigate();

  // Cloudinary upload function
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
      ); // Using Vite's env variable

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`, // Using Vite's env variable
          formData
        );

        // Log the response to verify it's working
        console.log("Cloudinary response:", response.data);

        setImageUrl(response.data.secure_url); // Get the URL
        setImage(file); // Optionally, store the image file for further use (e.g., for preview)
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
      }
    }
  };

  // Handle the blog publish
  const handlePublish = async () => {
    if (!imageUrl) {
      console.error("No image URL available. Please upload an image.");
      return;
    }

    try {
      // Send the blog post data to your backend, including the image URL
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        { title, content, image: imageUrl }, // Include image URL in the payload
        { headers: { authorization: localStorage.getItem("token") } }
      );

      // Navigate to the newly published blog page
      navigate(`/blog/${response.data.id}`);
    } catch (error) {
      console.error("Error publishing the blog:", error);
    }
  };

  return (
    <div>
      <Appbar />
      <div className="flex justify-center w-full pt-8">
        <div className="max-w-screen-lg w-full">
          {/* Title Input */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4"
            placeholder="Title"
          />

          {/* Content Text Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mb-4"
            placeholder="Write your content here"
          />

          {/* Image Upload Input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4"
          />

          {/* Display Uploaded Image Preview */}
          {imageUrl && (
            <div className="mb-4">
              <p>Uploaded Image:</p>
              <img
                src={imageUrl}
                alt="Uploaded"
                className="max-w-full h-auto"
              />
            </div>
          )}

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            Publish post
          </button>
        </div>
      </div>
    </div>
  );
};
