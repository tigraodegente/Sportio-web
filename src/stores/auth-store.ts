import { create } from "zustand";

type AuthModal = "login" | "register" | null;

interface AuthStore {
  modal: AuthModal;
  openLogin: () => void;
  openRegister: () => void;
  closeModal: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  modal: null,
  openLogin: () => set({ modal: "login" }),
  openRegister: () => set({ modal: "register" }),
  closeModal: () => set({ modal: null }),
}));
