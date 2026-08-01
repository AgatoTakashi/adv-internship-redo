import Image from "next/image";
import landing from "@/assets/landing.png";
import { useDispatch } from "react-redux";
import { openModal } from "@/store/modalSlice";

export default function Landing() {
  const dispatch = useDispatch();
  return (
    <section id="landing" className="py-10">
      <div className="max-w-[1070px] mx-auto px-6 flex flex-col md:flex-row">
        <div className="flex-1">
          <h1 className="text-[#032b41] text-[40px] font-bold mb-6 leading-[1.2]">
            Gain more knowledge <br className="hidden md:block" />
            in less time
          </h1>

          <p className="text-[#394547] text-[20px] font-light leading-[1.5] mb-6">
            Great summaries for busy people,
            <br className="hidden md:block" />
            individuals who barely have time to read,
            <br className="hidden md:block" />
            and even people who don’t like to read.
          </p>

          <button className="btn home__cta--btn" onClick={() => dispatch(openModal("login"))}>Login</button>
        </div>

        <div className="flex-1 hidden md:flex justify-end">
          <Image src={landing} alt="Landing" className="max-w-[400px]" />
        </div>
      </div>
    </section>
  );
}
