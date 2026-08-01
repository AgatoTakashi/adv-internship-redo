import Image from "next/image";
import logo from "@/assets/logo.png"
import { useDispatch } from "react-redux";
import { openModal } from "@/store/modalSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  return (
    <nav className="h-20 flex items-center">
      <div className="max-w-[1070px] w-full mx-auto px-6 flex justify-between items-center">
        <div className="max-w-[200px]">
          <Image
            src={logo}
            alt="Summarist Logo"
            className="w-full h-full"
          />
        </div>

        <ul className="flex gap-6">
          <li className="text-[#032b41] hover:text-[#2bd97c]" onClick={() => dispatch(openModal("login"))}>Login</li>
          <li className="text-[#032b41] cursor-not-allowed">About</li>
          <li className="text-[#032b41] cursor-not-allowed">Contact</li>
          <li className="text-[#032b41] cursor-not-allowed">Help</li>
        </ul>
      </div>
    </nav>
  );
}
