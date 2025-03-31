import { create } from "zustand";

interface Blog {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  published: boolean;
  author: {
    name: string;
  };
}

interface UserInfo {
  id: number;
  username: string;
  name: string | null;
  bio: string | null;
  bookmarkedBlogs: { blog: Blog }[];
}

interface UserInfoState {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo) => void;
  clearUserInfo: () => void;
  theme: "white" | "black";
  setTheme: (theme: "white" | "black") => void;
  toggleTheme: () => void;
}

const useUserInfoStore = create<UserInfoState>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
  clearUserInfo: () => set({ userInfo: null }),
  // Initialize theme from localStorage, defaulting to "black"
  theme: localStorage.getItem("theme") === "black" ? "black" : "white",
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "black" ? "white" : "black";
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),
}));

export default useUserInfoStore;
