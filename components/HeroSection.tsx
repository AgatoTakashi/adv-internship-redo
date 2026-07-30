import Image from "next/image";
import pricing from "@/assets/pricing-top.png"; // adjust path if needed

export default function HeroSection() {
  return (
    <div className="choose-plan w-full bg-[#032b41] rounded-bl-[16rem] rounded-br-[16rem]">
      <div className="hero flex">
        <div className="row flex flex-col items-center !max-w-[1000px]">
          <h1 className="mt-[48px] mb-[40px] text-[48px] text-center text-white font-bold">
            Get unlimited access to many amazing books to read
          </h1>

          <h4 className="text-center text-[20px] mb-[24px] text-white">
            Turn ordinary moments into amazing learning opportunities
          </h4>

          <div className="img-wrapper max-w-[340px] rounded-tl-[180px] rounded-tr-[180px] overflow-hidden">
            <Image src={pricing} alt="pricing" />
          </div>
        </div>
      </div>
    </div>
  );
}
