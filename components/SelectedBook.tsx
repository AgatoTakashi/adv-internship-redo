import Image from "next/image";
import { Book } from "@/types/Book";

export default async function SelectedBook() {
  let book: Book | null = null;

  try {
    const res = await fetch(
      "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected",
      { cache: "no-store" }
    );

    const data = await res.json();

    // API returns an array, even for selected
    book = Array.isArray(data) ? data[0] : data;

  } catch (err) {
    book = null;
  }

  if (!book || !book.imageLink || book.imageLink.trim() === "") {
    return (
      <div className="max-w-[1070px] mx-auto px-6 py-10 text-[#032b41]">
        No selected book found.
      </div>
    );
  }

  return (
    <section className="py-10">
      <div className="max-w-[1070px] mx-auto px-6 flex gap-10 items-center">
        <Image
          src={book.imageLink}
          alt={book.title}
          width={160}
          height={240}
          className="rounded-md shadow-md object-cover"
        />

        <div>
          <p className="text-[#2bd97c] font-semibold mb-2">Selected just for you</p>
          <h2 className="text-3xl font-bold text-[#032b41] mb-2">{book.title}</h2>
          <p className="text-lg text-[#394547] mb-4">{book.subTitle}</p>
          <p className="text-sm text-[#394547]">{book.author}</p>
        </div>
      </div>
    </section>
  );
}
