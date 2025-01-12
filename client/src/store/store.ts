import { create } from "zustand";

interface UserInfoState {
  userInfo: any | null;
  setUserInfo: (userInfo: any) => void;
  clearUserInfo: () => void;
}

const useUserInfoStore = create<UserInfoState>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
  clearUserInfo: () => set({ userInfo: null }),
}));

export default useUserInfoStore;
