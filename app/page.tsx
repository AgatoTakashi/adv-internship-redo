"use client"

import Navbar from "@/components/Navbar";
import Landing from "@/components/Landing";
import Features from "@/components/Features";
import Reviews from "@/components/Reviews";
import Numbers from "@/components/Numbers";
import Footer from "@/components/Footer";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
const user = useSelector((s: RootState) => s.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/for-you");
    }
  }, [user, router]);

  return (
    <>
      <Navbar />
      <Landing />
      <Features />
      <Reviews />
      <Numbers />
      <Footer />
    </>
  );
}
