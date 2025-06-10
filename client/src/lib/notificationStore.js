import { create } from "zustand";
import server from "../lib/axios";
const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async () => {
    const res = await server("/users/notification");
    set({ number: res.data });
  },
  decrease: () => {
    set((prev) => ({ number: prev.number - 1 }));
  },
  reset: () => {
    set({ number: 0 });
  },
}));
export default useNotificationStore;
