"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/assets/logo.png";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/client";
import { useDispatch } from "react-redux";
import { openModal } from "@/store/modalSlice";
import { logout as logoutUser } from "@/store/authSlice";

import {
  FiHome,
  FiBookOpen,
  FiStar,
  FiSearch,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi";

export default function LoggedInNavbar() {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    if (!auth) {
      dispatch(logoutUser());
      return;
    }

    try {
      await signOut(auth);
      dispatch(logoutUser());
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const pathname = usePathname();
  const isPlayerPage = pathname?.startsWith("/player") ?? false;

  const linkClasses = (href: string) =>
    `
      flex items-center gap-3
      text-[16px]
      ${pathname === href ? "font-semibold text-[#032b41]" : "text-[#032b41]"}
    `;

  const indicator = (href: string) =>
    pathname === href ? (
      <div className="w-1 h-6 bg-[#032b41] rounded-r-md" />
    ) : (
      <div className="w-1 h-6" />
    );

  return (
    <aside
      className="
        fixed left-0 top-0
        h-screen w-64
        bg-[#f7faf9]
        border-r border-gray-200
        flex flex-col
        py-8
      "
    >
      {/* -------------------- GROUP 1: LOGO -------------------- */}
      <div className="px-8 flex items-center mb-10">
        <Image src={logo} alt="Summarist" width={160} height={40} priority />
      </div>

      {/* -------------------- GROUP 2: MAIN NAVIGATION -------------------- */}
      <nav className="px-8 space-y-6 text-[#032b41]">
        <Link href="/for-you" className={linkClasses("/for-you")}>
          {indicator("/for-you")}
          <FiHome size={24} />
          <span>For You</span>
        </Link>

        <Link href="/library" className={linkClasses("/library")}>
          {indicator("/library")}
          <FiBookOpen size={24} />
          <span>My Library</span>
        </Link>

        <Link href="" className={`${linkClasses("/highlights")} cursor-not-allowed`}>
          {indicator("/highlights")}
          <FiStar size={24} />
          <span>Highlights</span>
        </Link>

        <Link href="" className={`${linkClasses("/search")} cursor-not-allowed`}>
          {indicator("/search")}
          <FiSearch size={24} />
          <span>Search</span>
        </Link>
      </nav>

      {/* -------------------- GROUP 3: SETTINGS + HELP + LOGOUT -------------------- */}
      <div className={`mt-auto px-8 space-y-6 text-[#032b41] ${isPlayerPage ? "-translate-y-[80px]" : ""}`}>
        <Link href="/settings" className={linkClasses("/settings")}>
          {indicator("/settings")}
          <FiSettings size={24} />
          <span>Settings</span>
        </Link>

        <Link href="" className={`${linkClasses("/support")} cursor-not-allowed`}>
          {indicator("/support")}
          <FiHelpCircle size={24} />
          <span>Help & Support</span>
        </Link>

        {user ? (<button className="flex items-center gap-3 text-[16px]" onClick={handleLogout}>
          <div className="w-1 h-6" />
          <FiLogOut size={24} />
          <span>Logout</span>
        </button>
        ):(
        <button className="flex items-center gap-3 text-[16px]" onClick={() => dispatch(openModal("login"))}>
          <div className="w-1 h-6" />
          <FiLogOut size={24} />
          <span>Login</span>
        </button>)}
      </div>
    </aside>
  );
}
