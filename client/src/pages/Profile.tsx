import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Avatar } from "../components/BlogCard"; // Import Avatar component
import useUserInfoStore from "../store/store";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useUserInfoStore();

  // Create a local state to store the editable fields
  const [user, setUser] = useState({
    fullName: userInfo?.name || "",
    bio: userInfo?.bio || "",
    email: userInfo?.username || "",
    password: "",
  });

  // Fetch user info if not available in store
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userInfo) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${BACKEND_URL}/api/v1/user-info`, {
            headers: { authorization: token || "" },
          });
          const { name, bio, username, id } = response.data.user;
          setUserInfo({ id, name, bio, username, bookmarkedBlogs: [] });
          setUser({ fullName: name, bio: bio, email: username, password: "" });
        } catch (error) {
          console.error("Error fetching user info:", error);
          alert("Failed to load profile information.");
        }
      }
    };
    fetchUserInfo();
  }, [userInfo, setUserInfo]);

  // Handle input changes for editable fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Handle saving updated profile information
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/user/update`,
        {
          fullName: user.fullName,
          bio: user.bio,
          password: user.password,
        },
        {
          headers: { authorization: token || "" },
        }
      );
      alert("Profile updated successfully!");
      // Optionally, update store state after saving
      setUserInfo({ ...userInfo, name: user.fullName, bio: user.bio });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-yellow-600 text-white p-2 rounded-full hover:bg-yellow-700"
      >
        ←
      </button>

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-xl w-2/3 h-[70vh] p-6 flex">
        {/* Left Section */}
        <div className="w-2/3 p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={user.fullName}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">Bio</label>
              <input
                type="text"
                name="bio"
                value={user.bio}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                disabled
                className="w-full border rounded-lg px-3 py-2 bg-gray-200 text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleInputChange}
                placeholder="Enter a new password"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Save
          </button>
        </div>

        {/* Right Section - Avatar */}
        <div className="w-1/3 flex items-center justify-center">
          <Avatar name={user.fullName} size="xl" />
        </div>
      </div>
    </div>
  );
};
