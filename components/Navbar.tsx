import Image from "next/image";
import logo from "@/assets/logo.png"

export default function Navbar() {
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
          <li className="text-[#032b41] cursor-not-allowed">Home</li>
          <li className="text-[#032b41] cursor-not-allowed">About</li>
          <li className="text-[#032b41] cursor-not-allowed">Pricing</li>
          <li className="text-[#032b41] hover:text-[#2bd97c] cursor-pointer">
            Login
          </li>
        </ul>
      </div>
    </nav>
  );
}
