import { create } from "zustand";

// Define a proper type for userInfo
interface User {
  username: string;
  email: string;
  profileImg: string;
}

interface UserState {
  userInfo: User | null;
  setUserInfo: (user: User) => void;
  clearUserInfo: () => void;
}

// Create the store
const useUserInfoStore = create<UserState>((set) => ({
  userInfo: null,
  setUserInfo: (user: User) => set({ userInfo: user }), // Action to set user info
  clearUserInfo: () => set({ userInfo: null }), // Action to clear user info
}));

export default useUserInfoStore;
