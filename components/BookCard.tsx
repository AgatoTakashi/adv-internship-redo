import Link from "next/link";
import Image from "next/image";
import { Book } from "@/types/Book";

export default function BookCard({ book }: { book: Book }) {
  if (!book || !book.imageLink) return null;

  return (
    <Link href={`/book/${book.id}`} className="block">
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer w-[180px] flex-shrink-0">
        <div className="w-full flex justify-center mb-4">
          <Image
            src={book.imageLink}
            alt={book.title}
            width={120}
            height={180}
            className="rounded-md object-cover"
          />
        </div>

        <h3 className="text-[#032b41] font-semibold text-[15px] leading-tight mb-1">
          {book.title}
        </h3>

        <p className="text-[#394547] text-[13px] mb-2">{book.author}</p>

        {book.subscriptionRequired && (
          <span className="inline-block mt-2 text-[11px] bg-yellow-400 text-black px-2 py-1 rounded">
            Premium
          </span>
        )}
      </div>
    </Link>
  );
}
