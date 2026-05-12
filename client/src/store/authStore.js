import { create } from "zustand";
import { api } from "../services/api";

export const useAuthStore = create((set) => ({
  user: null,
  ready: false,
  async loadUser() {
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.user, ready: true });
    } catch {
      set({ user: null, ready: true });
    }
  },
  async login(input) {
    const { data } = await api.post("/auth/login", input);
    set({ user: data.user, ready: true });
    return data.user;
  },
  async register(input) {
    const { data } = await api.post("/auth/register", input);
    set({ user: data.user, ready: true });
    return data.user;
  },
  async logout() {
    await api.post("/auth/logout");
    set({ user: null, ready: true });
  },
}));
