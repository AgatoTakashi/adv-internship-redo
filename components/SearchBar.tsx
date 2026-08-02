"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Book } from "@/types/Book";

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

  return (
    <div className="relative w-full">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for books"
        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm"
      />

      {query && (
        <div className="absolute left-0 top-full z-20 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="max-h-72 overflow-y-auto">
              {results.map((book) => (
                <li key={book.id}>
                  <Link
                    href={`/book/${book.id}`}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[#032b41] hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{book.title}</div>
                      <div className="truncate text-xs text-gray-500">{book.author}</div>
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
