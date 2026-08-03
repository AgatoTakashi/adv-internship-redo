"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Book } from "@/types/Book";
import { FaPlayCircle } from "react-icons/fa";
import AudioDuration from "./AudioDuration";

export default function SelectedBook() {
  const [book, setBook] = useState<Book | null>(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadBook = async () => {
      try {
        const res = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected",
          { cache: "no-store" }
        );

        const data = await res.json();
        const selectedBook = Array.isArray(data) ? data[0] : data;

        if (isMounted) {
          setBook(selectedBook || null);
        }
      } catch {
        if (isMounted) {
          setBook(null);
        }
      }
    };

    loadBook();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatTime = (value: number) => {
    if (!Number.isFinite(value) || value < 0) return "0:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}mins ${seconds.toString().padStart(2, "0")}secs`;
  };

  if (!book || !book.imageLink || book.imageLink.trim() === "") {
    return (
      <div className="max-w-[1070px] mx-auto px-6 py-10 text-[#032b41]">
        No selected book found.
      </div>
    );
  }

  return (
    <section className="">
      <div className="max-w-[1070px] mx-auto px-6 gap-10 items-center">
        <p className="text-[22px] font-semibold text-[#032b41] mb-6">Selected just for you</p>
        <div className="flex w-2/3 bg-[#fbefd6] p-[20px] rounded-md leading-[1.2]">
          {book.subTitle}
          <div className="w-[1px] bg-[#bac8ce] mx-[20px]"></div>
          <Image
            src={book.imageLink}
            alt={book.title}
            width={140}
            height={140}
            className="rounded-md object-cover mr-[8px]"
          />

          <div className="w-[60%]">
            <h2 className="text-[16px] font-bold text-[#032b41] mb-2">{book.title}</h2>
            <p className="text-[14px] text-[#394547] mb-4">{book.author}</p>
            <div className="flex items-center">
              <FaPlayCircle className="text-[40px] mr-2 font-semibold" />
              <AudioDuration audioLink={book.audioLink} formatter={formatTime} className="ml-1" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
