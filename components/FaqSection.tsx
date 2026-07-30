"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string[];
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      {items.map((faq, index) => (
        <div key={index} className="border-b pb-4">
          {/* Header */}
          <button
            onClick={() => toggle(index)}
            className="w-full text-left flex justify-between items-center py-3"
          >
            <h2 className="text-[22px] font-semibold">
              {faq.question}
            </h2>

            <span className="text-[22px] font-bold">
              {openIndex === index ? "−" : "+"}
            </span>
          </button>

          {/* Body */}
          {openIndex === index && (
            <div className="mt-2 space-y-3 text-[16px] leading-relaxed">
              {faq.answer.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
