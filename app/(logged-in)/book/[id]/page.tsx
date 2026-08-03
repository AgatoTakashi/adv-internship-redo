"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CiBookmark, CiStar } from "react-icons/ci";
import { GoClock } from "react-icons/go";
import { FiMic } from "react-icons/fi";
import { HiOutlineLightBulb } from "react-icons/hi";
import { LuBookOpenText } from "react-icons/lu";
import { BookDetailSkeleton } from "@/components/Skeleton";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export default function BookPage({ params }: BookPageProps) {
  const [book, setBook] = useState<any>(null);
  const [duration, setDuration] = useState(0);
  const [id, setId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadParams = async () => {
      const resolvedParams = await params;
      if (isMounted) {
        setId(resolvedParams.id);
      }
    };

    loadParams();

    return () => {
      isMounted = false;
    };
  }, [params]);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const loadBook = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`,
          { cache: "no-store" }
        );

        const raw = await res.text();
        if (!raw || !isMounted) return;

        const parsedBook = JSON.parse(raw);
        setBook(parsedBook);
      } catch {
        if (isMounted) {
          setBook(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!book?.audioLink) {
      setDuration(0);
      return;
    }

    const audioElement = new Audio(book.audioLink);

    const updateDuration = () => {
      if (Number.isFinite(audioElement.duration)) {
        setDuration(audioElement.duration);
      }
    };

    audioElement.addEventListener("loadedmetadata", updateDuration);
    audioElement.addEventListener("canplay", updateDuration);
    audioElement.load();

    return () => {
      audioElement.pause();
      audioElement.removeEventListener("loadedmetadata", updateDuration);
      audioElement.removeEventListener("canplay", updateDuration);
    };
  }, [book?.audioLink]);

  const formatTime = (value: number) => {
    if (!Number.isFinite(value) || value < 0) return "0:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isLoading && !book) {
    return <BookDetailSkeleton />;
  }

  if (!book) {
    return <BookDetailSkeleton />;
  }

  return (
    <div className="flex p-[32px] pt-[0] bg-white">
      {/* LEFT SIDE */}
      <div className="w-3/4 mr-5">
        {/* Title */}
        <h1 className="mb-[16px] text-[32px] font-semibold text-[#032b41]">
          {book.title}
        </h1>

        {/* Author */}
        <p className="font-bold mb-[16px] text-[18px] text-[#032b41]">
          {book.author}
        </p>

        {/* Subtitle */}
        <p className="border-b mb-[16px] text-[20px] font-light pb-[16px] text-[#032b41]">
          {book.subTitle}
        </p>

        {/* Rating + Duration */}
        <div className="flex pb-[16px]">
          <div className="text-[14px] font-bold flex items-center w-[200px] text-[#032b41]">
            <CiStar className="text-[24px] mr-[4px]" /> {book.averageRating} ({book.totalRating} ratings)
          </div>
          <div className="text-[14px] font-bold flex items-center w-[200px] text-[#032b41]">
            <GoClock className="text-[24px] mr-[4px]" /> <p>{formatTime(duration)}</p>
          </div>
        </div>

        {/* Audio/Text + Key Ideas */}
        <div className="flex border-b pb-[16px]">
          <div className="text-[14px] font-bold flex items-center w-[200px] text-[#032b41]">
            <FiMic className="text-[24px] mr-[4px]" /> Audio & Text
          </div>
          <div className="text-[14px] font-bold flex items-center w-[200px] text-[#032b41]">
            <HiOutlineLightBulb className="text-[24px] mr-[4px]" /> {book.keyIdeas} Key ideas
          </div>
        </div>

        {/* Buttons */}
        <div className="flex mt-[24px]">
          <Link
            href={`/player/${id}`}
            className="flex items-center justify-center text-[16px] text-white bg-[#032b41] px-8 py-3 rounded mr-[16px]"
          >
            <LuBookOpenText className="text-[24px] mr-[4px]" /> Read
          </Link>
          <Link
            href={`/player/${id}`}
            className="flex items-center justify-center text-[16px] text-white bg-[#032b41] px-8 py-3 rounded"
          >
            <FiMic className="text-[24px] mr-[4px]" /> Listen
          </Link>
        </div>

        {/* Save */}
        <div className="flex items-center text-blue-600 text-[18px] font-bold mt-[24px] mb-[32px]">
          <CiBookmark className="text-[24px] mr-[4px]" /> Add title to My Library
        </div>

        {/* What's it about */}
        <h2 className="text-[22px] font-semibold text-[#032b41] mb-2">
          What's it about?
        </h2>

        {/* Tags */}
        <div className="flex font-bold text-[#032b41] mb-4">
          {book.tags?.map((tag: any, i: number) => (
            <div key={i} className="tag mr-[16px] bg-[#f7faf9] px-8 py-3 rounded">
              {tag}
            </div>
          ))}
        </div>

        {/* Summary */}
        <p className="mt-[16px] mb-[16px] text-[#032b41] leading-relaxed">
          {book.bookDescription}
        </p>

        {/* About the author */}
        <h2 className="text-[22px] font-semibold text-[#032b41] mb-2">
          About the author
        </h2>

        <p className="text-[#032b41] leading-relaxed">
          {book.authorDescription}
        </p>
      </div>

      {/* RIGHT SIDE — Book Image */}
      <div className="w-[300px]">
        <Image
        src={book.imageLink}
        width={300}
        height={300}
        alt="Book cover"
        className=""
        />
      </div>
    </div>
  );
}
