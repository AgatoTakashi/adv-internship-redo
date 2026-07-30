"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import AuthModal from "@/components/AuthModal";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthModal />
      {children}
    </Provider>
  );
}
