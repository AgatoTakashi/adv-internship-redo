"use client";

import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { store } from "@/store";
import AuthModal from "@/components/AuthModal";
import { auth } from "@/app/firebase/client";
import { clearUser, setUser } from "@/store/authSlice";

function AuthStateSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth) {
      dispatch(clearUser());
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const serializedUser = user
        ? {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            providerId: user.providerData?.[0]?.providerId ?? null,
          }
        : null;

      dispatch(user ? setUser(serializedUser) : clearUser());
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthStateSync />
      <AuthModal />
      {children}
    </Provider>
  );
}
