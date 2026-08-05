"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Book } from "@/types/Book";
import { CiStar } from "react-icons/ci";
import { GoClock } from "react-icons/go";
import AudioDuration from "./AudioDuration";
import { RootState } from "@/store";
import { auth, db } from "@/app/firebase/client";

const normalizeSubscriptionPlan = (data: Record<string, unknown> | undefined) => {
  if (!data) return "";

  return (
    (data.planName as string | undefined) ||
    (data.plan as { name?: string; display_name?: string } | undefined)?.name ||
    (data.plan as { name?: string; display_name?: string } | undefined)?.display_name ||
    (data.productName as string | undefined) ||
    (data.subscription as { planName?: string } | undefined)?.planName ||
    ""
  );
};

export default function BookCard({ book }: { book: Book }) {
  const currentUser = useSelector((state: RootState) => state.auth.user) as
    | { uid?: string; email?: string | null }
    | null;
  const [planName, setPlanName] = useState("");

  useEffect(() => {
    const uid = currentUser?.uid || auth?.currentUser?.uid;

    if (!uid || !db) {
      setPlanName("");
      return;
    }

    let isMounted = true;

    const resolvePlanName = async () => {
      if (!db) {
        if (isMounted) {
          setPlanName("");
        }
        return;
      }

      try {
        const userDocRef = doc(db, "users", uid);
        const customerDocRef = doc(db, "customers", uid);
        const subscriptionsRef = collection(db, "customers", uid, "subscriptions");

        const [userSnap, customerSnap, subscriptionsSnap] = await Promise.all([
          getDoc(userDocRef),
          getDoc(customerDocRef),
          getDocs(subscriptionsRef),
        ]);

        if (!isMounted) return;

        const candidates = [
          normalizeSubscriptionPlan(userSnap.data() as Record<string, unknown> | undefined),
          normalizeSubscriptionPlan(customerSnap.data() as Record<string, unknown> | undefined),
          normalizeSubscriptionPlan(
            subscriptionsSnap.docs[0]?.data() as Record<string, unknown> | undefined
          ),
        ];

        const resolvedPlan = candidates.find((value) => Boolean(value)) || "";
        setPlanName(resolvedPlan);
      } catch {
        if (isMounted) {
          setPlanName("");
        }
      }
    };

    resolvePlanName();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.uid]);

  if (!book || !book.imageLink) return null;

  const formatTime = (value: number) => {
    if (!Number.isFinite(value) || value < 0) return "0:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}mins ${seconds.toString().padStart(2, "0")}secs`;
  };

  return (
    <Link href={`/book/${book.id}`} className="block">
      <div className="relative bg-white p-3 hover:bg-[#f1f6f4] transition cursor-pointer w-[196px] h-[386px] flex-shrink-0">
        <div className="flex justify-center mb-4">
          <Image
            src={book.imageLink}
            alt={book.title}
            width={172}
            height={172}
            className=""
          />
        </div>

        <h3 className="text-[#032b41] font-semibold text-[16px] leading-tight mb-1">
          {book.title}
        </h3>

        <p className="text-[#394547] font-light text-[14px] mb-1">{book.author}</p>

        <p className="text-[14px] mb-1 leading-tight">{book.subTitle}</p>

        <div className="div flex font-light">
          <div className="div flex items-center mr-[8px]">
            <GoClock className="text-[16px] mr-[4px]" />
            <AudioDuration audioLink={book.audioLink} formatter={formatTime} className="text-[14px]" />
          </div>
          <div className="div flex items-center">
            <CiStar className="text-[16px] mr-[4px]" /><p className="text-[14px]">{book.averageRating}</p>
          </div>
        </div>

        {book.subscriptionRequired && !planName.toLowerCase().includes("premium") && !planName.toLowerCase().includes("plus") && (
          <span className="absolute top-0 right-0 text-[11px] bg-[#032b41] text-white px-2 py-1 rounded-[500px]">
            Premium
          </span>
        )}
      </div>
    </Link>
  );
}
