import Footer from "@/components/Footer";
import FaqSection from "@/components/FaqSection";
import HeroSection from "@/components/HeroSection";
import PlanFeaturesWrapper from "@/components/PlansFeaturesWrapper";

export default function ChoosePlanPage() {
  const faqItems = [
    {
      question: "How does the free 7-day trial work?",
      answer: [
        "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial."
      ]
    },
    {
      question: "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
      answer: [
        "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option."
      ]
    },
    {
      question: "What's included in the Premium plan?",
      answer: [
        "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle."
      ]
    },
    {
      question: "Can I cancel during my trial or subscription?",
      answer: [
        "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day."
      ]
    }
  ];

  return (
    <div className="bg-white text-[#032b41]">
      {/* HERO */}
        <HeroSection />
        <PlanFeaturesWrapper />

      {/* PLANS */}
      <div className="select-options flex flex-col items-center">
        <h1 className="text-center mt-[20px] mb-[30]">Choose the plan the fits you</h1>

        {/* Option 1 */}
        <div className="border-4 border-[#bac8ce] w-[680px] h-[140px] rounded-[5px] flex gap-[20px] p-[24px] mb-[16px] selected">
          <div className="circle-container w-1/10">
            <div className="relative w-[24px] h-[24px] rounded-full border-2 border-black flex items-center justify-center">
              <div className="dot absolute w-[6px] h-[6px] bg-black rounded-full hidden"></div>
            </div>
          </div>
          <div className="text w-9/10">
            <div className="text-top font-bold text-[18px]">Premium Plus Yearly</div>
            <div className="text-middle font-bold text-[24px] mt-[8px] mb-[8px]">$99.99/year</div>
            <div className="text-bottom text-[14px]">7-day free trial included</div>
          </div>
        </div>

        {/* SEPARATOR */}
          <div className="auth__separator">
            <span className="auth__seperator--text">or</span>
          </div>

        {/* Option 2 */}
        <div className="border-4 border-[#bac8ce] w-[680px] h-[140px] rounded-[5px] flex gap-[20px] p-[24px] mb-[16px]">
          <div className="circle-container w-1/10">
            <div className="relative w-[24px] h-[24px] rounded-full border-2 border-black flex items-center justify-center">
              <div className="dot absolute w-[6px] h-[6px] bg-black rounded-full hidden"></div>
            </div>
          </div>
          <div className="text w-9/10">
            <div className="text-top font-bold text-[18px]">Premium Monthly</div>
            <div className="text-middle font-bold text-[24px] mt-[8px] mb-[8px]">$9.99/month</div>
            <div className="text-bottom text-[14px]">No trial included</div>
          </div>
        </div>
      </div>

      <div className="bottom-0 bg-white sticky flex flex-col items-center pt-[32px]">
        <button
          id="trial-button"
          className="plan-btn text-[16px] w-[300px] h-[40px] mb-[16px]"
        >
          Start your free 7-day trial
        </button>

        <p
          id="trial-text"
          className="font-normal text-[12px] text-center mb-[60px]"
        >
          Cancel your trial at any time before it ends, and you won’t be charged.
        </p>
      </div>

      {/* FAQ (refactored) */}
      <FaqSection items={faqItems} />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
