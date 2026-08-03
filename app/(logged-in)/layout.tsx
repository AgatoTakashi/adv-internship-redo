import LoggedInNavbar from "@/components/LoggedInNavbar";
import SearchBar from "@/components/SearchBar";

export default function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <LoggedInNavbar />

      {/* Main content */}
      <main className="ml-64 w-full bg-white">   {/* ✔ white background */}
        {/* Search bar */}
        <div className="border-b border-gray-300 h-[80px] flex items-center">
          <div className="max-w-[1070px] mx-auto px-8 w-full">
            <SearchBar />
          </div>
        </div>

        {/* Page content */}
        <div className="max-w-[1070px] mx-auto px-8 pt-10 space-y-10">
          {children}
        </div>
      </main>
    </div>
  );
}
