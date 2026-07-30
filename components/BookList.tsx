import { Book } from "@/types/Book";
import BookCard from "./BookCard";

export default async function BookList({
  title,
  status,
  variant = "grid",
}: {
  title: string;
  status: "recommended" | "suggested";
  variant?: "grid" | "horizontal";
}) {
  // Fetch books from API
  const books: Book[] = await fetch(
    `https://us-central1-summaristt.cloudfunctions.net/getBooks?status=${status}`,
    { cache: "no-store" }
  )
    .then((res) => res.json())
    .catch(() => []);

  // Prevent rendering empty lists
  if (!books || books.length === 0) return null;

  return (
    <section className="py-10">
      <div className="max-w-[1070px] mx-auto px-6">
        <h2 className="text-[22px] font-semibold text-[#032b41] mb-6">
          {title}
        </h2>

        {variant === "horizontal" ? (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {books.slice(0,5).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {books.slice(0,5).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
