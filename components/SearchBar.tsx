"use client";

import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
  return (
    <div className="relative w-full">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
      <input
        type="text"
        placeholder="Search for books"
        className="border rounded-md pl-10 pr-3 py-2 w-full text-sm"
      />
    </div>
  );
}
