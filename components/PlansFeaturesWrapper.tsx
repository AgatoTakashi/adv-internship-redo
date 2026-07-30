import { FiZap, FiUsers, FiStar } from "react-icons/fi";

export default function PlanFeaturesWrapper() {
  const features = [
    {
      icon: <FiZap size={32} className="text-[#032b41]" />,
      bold: "Key ideas in a few min",
      rest: " with many books to read"
    },
    {
      icon: <FiUsers size={32} className="text-[#032b41]" />,
      bold: "3 million",
      rest: " people growing with Summarist everyday"
    },
    {
      icon: <FiStar size={32} className="text-[#032b41]" />,
      bold: "Precise recommendations",
      rest: " collections curated by experts"
    }
  ];

  return (
    <div
      className="
        plan__features--wrapper
        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
        justify-items-center text-center
        gap-6 max-w-[800px] mx-auto mb-[56px] mt-[60px]
      "
    >
      {features.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-3">
          {/* Icon */}
          {item.icon}

          {/* Text */}
          <div className="text-[20px] text-[#032b41]">
            <span className="font-bold">{item.bold}</span>
            {item.rest}
          </div>
        </div>
      ))}
    </div>
  );
}
