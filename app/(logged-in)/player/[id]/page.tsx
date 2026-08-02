import Player from "@/components/Player";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerPage({ params }: BookPageProps) {
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

    return (
        <div className="max-w-[1070px] mx-auto px-8 py-10 space-y-12 mb-[80px]">
            <h1 className="text-[32px] font-semibold text-[#032b41] border-b border-gray-300 pb-[20px]">
                {book.title}
            </h1>
            <p className="whitespace-pre-line">
                {book.summary}
            </p>
            <Player id={book.id} />  
        </div>
    )
}