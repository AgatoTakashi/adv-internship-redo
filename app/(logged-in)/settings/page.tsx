"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { RootState } from "@/store";
import { auth, db } from "@/app/firebase/client";
import { openModal } from "@/store/modalSlice";
import loginImage from "@/assets/login.png";

type SubscriptionSummary = {
  planName: string;
  status: string;
  currentPeriodEnd: string | null;
};

const normalizeSubscription = (
  data: Record<string, unknown> | undefined
): SubscriptionSummary | null => {
  if (!data) return null;

  const planName =
    (data.planName as string | undefined) ||
    (data.plan as { name?: string; display_name?: string } | undefined)?.name ||
    (data.plan as { name?: string; display_name?: string } | undefined)?.display_name ||
    (data.productName as string | undefined) ||
    (data.subscription as { planName?: string } | undefined)?.planName ||
    "";

  const status =
    (data.status as string | undefined) ||
    (data.subscriptionStatus as string | undefined) ||
    (data.subscription as { status?: string } | undefined)?.status ||
    "";

  const currentPeriodEnd =
    (data.currentPeriodEnd as string | number | undefined) ||
    (data.current_period_end as string | number | undefined) ||
    (data.subscription as { currentPeriodEnd?: string | number } | undefined)?.currentPeriodEnd ||
    null;

  if (!planName && !status && !currentPeriodEnd) {
    return null;
  }

  return {
    planName: planName || "Basic",
    status: status || "No active subscription",
    currentPeriodEnd: currentPeriodEnd
      ? typeof currentPeriodEnd === "number"
        ? new Date(currentPeriodEnd * 1000).toLocaleDateString()
        : currentPeriodEnd
      : null,
  };
};

export default function SettingsPage() {
  const currentUser = useSelector((state: RootState) => state.auth.user) as
    | { uid?: string; email?: string | null }
    | null;
  const dispatch = useDispatch();
  const [subscription, setSubscription] = useState<SubscriptionSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = currentUser?.uid || auth?.currentUser?.uid;

    if (!uid || !db) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribeFns: Array<() => void> = [];

    const userDocUnsub = onSnapshot(doc(db, "users", uid), (snapshot) => {
      const data = snapshot.data();
      const normalized = normalizeSubscription(data);
      if (normalized) {
        setSubscription(normalized);
        setLoading(false);
      }
    });

    const customerDocUnsub = onSnapshot(doc(db, "customers", uid), (snapshot) => {
      const data = snapshot.data();
      const normalized = normalizeSubscription(data);
      if (normalized) {
        setSubscription(normalized);
        setLoading(false);
      }
    });

    const subscriptionsCollectionUnsub = onSnapshot(
      collection(db, "customers", uid, "subscriptions"),
      (snapshot) => {
        const rows = snapshot.docs.map((docItem) => docItem.data());
        const normalized = rows.length
          ? normalizeSubscription(rows[0] as Record<string, unknown>)
          : null;

        if (normalized) {
          setSubscription(normalized);
          setLoading(false);
        }
      }
    );

    unsubscribeFns.push(userDocUnsub, customerDocUnsub, subscriptionsCollectionUnsub);

    return () => {
      unsubscribeFns.forEach((unsubscribe) => unsubscribe());
    };
  }, [currentUser?.uid]);

  const planLabel = subscription?.planName || "Basic";
  const isBasicPlan = planLabel.toLowerCase().includes("basic") || !subscription;

  if (!currentUser) {
    return (
      <>
        <h1 className="text-[32px] font-semibold text-[#032b41] border-b border-gray-300 pb-[20px]">
          Settings
        </h1>
        <div className="max-w-[760px] mx-auto px-8 py-16 flex flex-col items-center text-center space-y-6">
          <Image src={loginImage} alt="Login illustration" width={460} height={317} priority />
          <div className="space-y-2">
            <h1 className="text-[28px] font-semibold text-[#032b41]">
              Log in to your account to see your details.
            </h1>
          </div>
          <button
            onClick={() => dispatch(openModal("login"))}
            className="bg-[#2bd97c] text-black px-6 py-3 rounded-md text-[16px] font-medium"
          >
            Login
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-[1070px] mx-auto px-8 py-10 space-y-12">
      <h1 className="text-[32px] font-semibold text-[#032b41] border-b border-gray-300 pb-[20px]">
        Settings
      </h1>

      <div className="space-y-2 border-b border-gray-300 pb-[20px]">
        <h2 className="text-[20px] font-semibold text-[#032b41]">
          Your Subscription plan
        </h2>

        <p className="text-[16px] text-[#032b41]">
          {loading ? "Basic" : planLabel}
        </p>

        {isBasicPlan? (
          <Link href="/choose-plan">
            <button
              className="mt-4 bg-[#2bd97c] text-white px-6 py-2 rounded-md text-[16px] font-medium"
            >
              Upgrade to Premium
            </button>
          </Link>
        ) : null}
      </div>

      <div className="space-y-2">
        <h2 className="text-[20px] font-semibold text-[#032b41]">Email</h2>

        <p className="text-[16px] text-[#032b41]">
          {currentUser?.email || auth?.currentUser?.email || "No email available"}
        </p>
      </div>
    </div>
  );
}
