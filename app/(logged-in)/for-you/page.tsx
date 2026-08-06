import SelectedBook from "@/components/SelectedBook";
import BookList from "@/components/BookList";

export default function ForYouPage() {
  return (
    <div className="space-y-10">
      <SelectedBook />

      <BookList
        title="Recommended For You"
        subtitle="We think you'll like these"
        status="recommended"
      />

      <BookList
        title="Suggested Books"
        subtitle="Browse those books"
        status="suggested"
      />
    </div>
  );
}
