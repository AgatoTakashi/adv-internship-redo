"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BsPauseCircle, BsPlayCircle } from "react-icons/bs";
import { TbRewindBackward10, TbRewindForward10 } from "react-icons/tb";

interface PlayerProps {
  id?: string;
}

interface BookData {
  title?: string;
  author?: string;
  imageLink?: string;
  audioLink?: string;
}

export default function Player({ id }: PlayerProps) {
  const [book, setBook] = useState<BookData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadBook = async () => {
      if (!id) return;

      const res = await fetch(
        `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`,
        { cache: "no-store" }
      );

      const raw = await res.text();
      if (!raw || !isMounted) return;

      const parsed = JSON.parse(raw) as BookData;
      setBook(parsed);
    };

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!book?.audioLink) return;

    const audioElement = new Audio(book.audioLink);
    setAudio(audioElement);

    const updateProgress = () => {
      setProgress(audioElement.currentTime || 0);
      setDuration(audioElement.duration || 0);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audioElement.addEventListener("timeupdate", updateProgress);
    audioElement.addEventListener("loadedmetadata", updateProgress);
    audioElement.addEventListener("ended", onEnded);

    return () => {
      audioElement.pause();
      audioElement.removeEventListener("timeupdate", updateProgress);
      audioElement.removeEventListener("loadedmetadata", updateProgress);
      audioElement.removeEventListener("ended", onEnded);
    };
  }, [book?.audioLink]);

  const formatTime = (value: number) => {
    if (!Number.isFinite(value) || value < 0) return "0:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlayback = async () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    await audio.play();
    setIsPlaying(true);
  };

  const seek = (value: number) => {
    if (!audio) return;
    audio.currentTime = value;
    setProgress(value);
  };

  const skip = (seconds: number) => {
    if (!audio) return;
    const nextTime = Math.min(Math.max(audio.currentTime + seconds, 0), audio.duration || 0);
    audio.currentTime = nextTime;
    setProgress(nextTime);
  };

  if (!book) {
    return <div className="p-10 text-[#032b41]">Loading audio player...</div>;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#042330] px-4 py-3 text-white shadow-lg z-50">
      <div className="flex flex-col w-full items-center gap-4 md:flex-row">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {book.imageLink ? (
            <Image src={book.imageLink} width={48} height={48} alt="book image" className="rounded" />
          ) : (
            <div className="h-12 w-12 rounded bg-slate-700" />
          )}
          <div className="min-w-0">
            <div className="text-sm font-semibold">{book.title || "Audio book"}</div>
            <div className="text-sm">{book.author || "author"}</div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center gap-2">
          <button onClick={() => skip(-10)} className="text-[30px]">
            <TbRewindBackward10 />
          </button>
          <button onClick={togglePlayback} className="px-[20px] text-[40px] text-white">
            {isPlaying ? <BsPauseCircle /> : <BsPlayCircle />}
          </button>
          <button onClick={() => skip(10)} className="text-[30px]">
            <TbRewindForward10 />
          </button>
        </div>

        <div className="flex min-w-[220px] max-w-[460px] flex-1 items-center gap-3">
          <span className="text-xs text-slate-300">{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={(event) => seek(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-600"
          />
          <span className="text-xs text-slate-300">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}