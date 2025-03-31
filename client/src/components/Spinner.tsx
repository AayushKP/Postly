import { motion } from "framer-motion";
import useUserInfoStore from "../store/store";

export const Spinner = () => {
  const { theme } = useUserInfoStore();
  const isLightMode = theme === "white";

  return (
    <div
      className={`flex flex-col justify-center items-center h-[100dvh] w-[100vw] ${
        isLightMode
          ? "bg-gradient-to-r from-amber-50 to-amber-100"
          : "bg-gradient-to-r from-gray-800 to-gray-700"
      }`}
    >
      <motion.div
        className="w-12 h-12 rounded-full"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        style={{ backgroundColor: isLightMode ? "#2563eb" : "#3b82f6" }}
      />
      <p
        className={`mt-4 text-lg font-semibold ${
          isLightMode ? "text-neutral-800" : "text-white"
        }`}
      >
        Loading...
      </p>
    </div>
  );
};
