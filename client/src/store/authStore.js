import { create } from "zustand";
import { api } from "../services/api";

export const useAuthStore = create((set) => ({
  user: null,
  ready: false,
  loadUser: async () => {
    try {
      const { data } = await api.get("/auth/me");
      console.log(data.data.user);
      set({ user: data.data?.user, ready: true });
    } catch (error) {
      set({ user: null, ready: true });
    }
  },
  login: async (input) => {
    const { data } = await api.post("/auth/login", input);
    const userData = data.data?.user;
    set({ user: userData, ready: true });
    return userData;
  },
  register: async (input) => {
    const { data } = await api.post("/auth/register", input);
    const userData = data.data?.user;
    set({ user: userData, ready: true });
    return userData;
  },
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null, ready: true });
    }
  },
}));
