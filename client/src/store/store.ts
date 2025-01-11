import { create } from "zustand";

// Define a proper type for userInfo
interface User {
  username: string;
  email: string;
  profileImg: string;
}

interface UserState {
  userInfo: User | null;
  setUserInfo: (user: User | null) => void; // Updated type to accept User | null
  clearUserInfo: () => void;
}

// Create the store
const useUserInfoStore = create<UserState>((set) => ({
  userInfo: null,
  setUserInfo: (user: User | null) => set({ userInfo: user }), // Action to set user info
  clearUserInfo: () => set({ userInfo: null }), // Action to clear user info
}));

export default useUserInfoStore;
