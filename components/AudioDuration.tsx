"use client";

import { useEffect, useState } from "react";

interface AudioDurationProps {
  audioLink?: string;
  className?: string;
  formatter?: (value: number) => string;
}

export default function AudioDuration({
  audioLink,
  className,
  formatter,
}: AudioDurationProps) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!audioLink) {
      setDuration(0);
      return;
    }

    let isMounted = true;
    const audioElement = new Audio();
    audioElement.preload = "metadata";
    audioElement.src = audioLink;

    const updateDuration = () => {
      if (!isMounted) return;
      const nextDuration = Number.isFinite(audioElement.duration) ? audioElement.duration : 0;
      setDuration(nextDuration);
    };

    const handleError = () => {
      if (isMounted) {
        setDuration(0);
      }
    };

    audioElement.addEventListener("loadedmetadata", updateDuration);
    audioElement.addEventListener("durationchange", updateDuration);
    audioElement.addEventListener("canplay", updateDuration);
    audioElement.addEventListener("loadeddata", updateDuration);
    audioElement.addEventListener("error", handleError);
    audioElement.load();

    return () => {
      isMounted = false;
      audioElement.pause();
      audioElement.removeEventListener("loadedmetadata", updateDuration);
      audioElement.removeEventListener("durationchange", updateDuration);
      audioElement.removeEventListener("canplay", updateDuration);
      audioElement.removeEventListener("loadeddata", updateDuration);
      audioElement.removeEventListener("error", handleError);
    };
  }, [audioLink]);

  const defaultFormatter = (value: number) => {
    if (!Number.isFinite(value) || value < 0) return "0:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return <span className={className}>{(formatter || defaultFormatter)(duration)}</span>;
}
