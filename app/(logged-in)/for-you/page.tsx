import SelectedBook from "@/components/SelectedBook";
import BookList from "@/components/BookList";

export default function ForYouPage() {
  return (
    <div className="space-y-10">
      <SelectedBook />

      <BookList
        title="Recommended For You"
        status="recommended"
        variant="horizontal"
      />

      <BookList
        title="Suggested Books"
        status="suggested"
        variant="grid"
      />
    </div>
  );
}
