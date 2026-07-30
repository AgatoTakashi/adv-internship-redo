import Image from "next/image";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookPage({ params }: BookPageProps) {

  const { id } = await params;

  const res = await fetch(
    `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`,
    { cache: "no-store" }
  );

  const raw = await res.text();

  if (!raw) {
    return (
      <div className="p-10 text-[#032b41]">
        <h1 className="text-[28px] font-semibold mb-4">Book not found</h1>
        <p className="text-[16px]">
          The book data could not be loaded. Please try again later.
        </p>
      </div>
    );
  }

  const book = JSON.parse(raw);
  console.log(book.tags)
  return (
    <div className="flex p-[32px] mt-[8px] bg-white">
      {/* LEFT SIDE */}
      <div className="w-3/4 pr-10">
        {/* Title */}
        <h1 className="mb-[16px] text-[32px] font-semibold text-[#032b41]">
          {book.title}
        </h1>

        {/* Author */}
        <p className="font-bold mb-[16px] text-[18px] text-[#032b41]">
          {book.author}
        </p>

        {/* Subtitle */}
        <p className="border-b mb-[16px] text-[20px] pb-[16px] text-[#032b41]">
          {book.subTitle}
        </p>

        {/* Rating + Duration */}
        <div className="flex pb-[16px]">
          <div className="text-[14px] font-bold flex items-center w-[200px] text-[#032b41]">
            ⭐ {book.averageRating} ({book.totalRating} ratings)
          </div>
          <div className="text-[14px] font-bold flex items-center w-[200px] text-[#032b41]">
            ⏱ {book.audioLength}
          </div>
        </div>

        {/* Audio/Text + Key Ideas */}
        <div className="flex border-b pb-[16px]">
          <div className="text-[14px] font-bold flex items-center w-[200px] text-[#032b41]">
            🎧 Audio & Text
          </div>
          <div className="text-[14px] font-bold flex items-center w-[200px] text-[#032b41]">
            💡 {book.keyIdeas} Key ideas
          </div>
        </div>

        {/* Buttons */}
        <div className="flex mt-[24px]">
          <button className="flex items-center justify-center text-[16px] text-white bg-[#032b41] px-4 py-2 rounded mr-[16px]">
            📖 Read
          </button>
          <button className="flex items-center justify-center text-[16px] text-white bg-[#032b41] px-4 py-2 rounded">
            🎧 Listen
          </button>
        </div>

        {/* Save */}
        <div className="flex items-center text-blue-600 font-bold mt-[24px] mb-[32px]">
          🔖 Add title to My Library
        </div>

        {/* What's it about */}
        <h2 className="text-[22px] font-semibold text-[#032b41] mb-2">
          What's it about?
        </h2>

        {/* Tags */}
        <div className="flex font-bold text-[#032b41] mb-4">
          {book.tags?.map((tag: any, i: number) => (
            <div key={i} className="tag mr-[16px] bg-[#f7faf9] px-3 py-1 rounded">
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
      <div className="w-1/4 flex justify-center">
        <Image
        src={book.imageLink}
        width={300}
        height={300}
        alt="Book cover"
        className="rounded shadow w-[300px] h-[300px] object-cover"
        />
      </div>
    </div>
  );
}
