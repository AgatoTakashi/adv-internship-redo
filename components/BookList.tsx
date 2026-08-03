import { Book } from "@/types/Book";
import BookCard from "./BookCard";

export default async function BookList({
  title,
  subtitle,
  status,
  variant = "grid",
}: {
  title: string;
  subtitle: string;
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
    <section className="">
      <div className="max-w-[1070px] mx-auto px-6">
        <h2 className="text-[22px] font-semibold text-[#032b41]">
          {title}
        </h2>
        <p className="font-light mb-6">{subtitle}</p>

        {variant === "horizontal" ? (
          <div className="flex overflow-hidden">
            {books.slice(0,5).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="flex overflow-hidden">
            {books.slice(0,5).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
