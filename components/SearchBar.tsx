"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { RxHamburgerMenu } from "react-icons/rx";
import { Book } from "@/types/Book";
import { GoClock } from "react-icons/go";
import AudioDuration from "./AudioDuration";
import Image from "next/image";
import { FaX } from "react-icons/fa6";
import { SearchResultsSkeleton } from "./Skeleton";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const fetchResults = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(debouncedQuery)}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Search failed");

        const data = (await res.json()) as Book[];

        if (isActive) {
          setResults(Array.isArray(data) ? data : []);
        }
      } catch {
        if (isActive) {
          setResults([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      isActive = false;
    };
  }, [debouncedQuery]);

  const handleClose = () => {
    setQuery("");
    setDebouncedQuery("");
    setResults([]);
    setIsLoading(false);
  };

  return (
    <div className="absolute top-5 right-5 w-full flex justify-end items-center">
      <div className="w-[340px] relative">
        <div className="absolute w-[24px] right-3 top-1/2 -translate-y-1/2 pl-[8px] border-l">
          {!query? <FiSearch />: <FaX onClick={handleClose} /> }
        </div>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for books"
          className="w-full rounded-md border border-gray-300 pl-5 pr-3 py-2 text-sm bg-[#f1f6f4]"
        />
      </div>

      <RxHamburgerMenu className="md:hidden ml-4 text-[24px]" />

      {query && (
        <div className="absolute right-0 top-full z-20 mt-2 p-4 max-w-[440px] w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {isLoading ? (
            <SearchResultsSkeleton count={3} />
          ) : results.length > 0 ? (
            <ul className="max-h-[640px] overflow-y-auto">
              {results.map((book) => (
                <li key={book.id}>
                  <Link
                    href={`/book/${book.id}`}
                    onClick={handleClose}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[#032b41] hover:bg-gray-50 border-b border-gray"
                  >
                    <Image src={book.imageLink} alt="book image" width={80} height={80} />
                    <div className="min-w-0">
                      <div className="font-medium text-[16px]">{book.title}</div>
                      <div className="text-[14px] font-light text-gray-500">{book.author}</div>
                      <div className="div flex font-light">
                        <div className="div flex items-center mr-[8px]">
                          <GoClock className="text-[16px] mr-[4px]" />
                          <AudioDuration audioLink={book.audioLink} className="text-[14px]" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">No books found</div>
          )}
        </div>
      )}
    </div>
  );
}
