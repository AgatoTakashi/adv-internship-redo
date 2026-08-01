"use client";

import { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

export const getCheckoutUrl = async (
  app: FirebaseApp,
  priceId: string
): Promise<string> => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (!user) throw new Error("User is not authenticated");

  const db = getFirestore(app);
  const planName = priceId.includes("year") ? "Premium Annual" : "Premium Monthly";

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    planName,
    planStatus: "pending",
    updatedAt: new Date().toISOString(),
  }, { merge: true });

  const checkoutSessionRef = collection(
    db,
    "customers",
    user.uid,
    "checkout_sessions"
  );

  const docRef = await addDoc(checkoutSessionRef, {
    price: priceId,
    planName,
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  });

  return new Promise<string>((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      const data = snap.data() as {
        error?: { message: string };
        url?: string;
      } | undefined;

      if (!data) return;

      if (data.error) {
        unsubscribe();
        reject(new Error(`An error occurred: ${data.error.message}`));
      }

      if (data.url) {
        unsubscribe();
        resolve(data.url);
      }
    });
  });
};
