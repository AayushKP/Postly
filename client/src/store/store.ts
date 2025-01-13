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
  id: number; // id is required
  username: string; // username should always be a string
  name: string | null;
  bio: string | null;
  bookmarkedBlogs: { blog: Blog }[];
}

interface UserInfoState {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo) => void;
  clearUserInfo: () => void;
}

const useUserInfoStore = create<UserInfoState>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
  clearUserInfo: () => set({ userInfo: null }),
}));



export default useUserInfoStore;
