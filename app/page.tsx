import NoteList from "@/components/NoteList";
import { SearchNote } from "@/components/SearchNote";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col-reverse items-start justify-between gap-2  sm:flex-row my-4">
        <SearchNote />
      </div>

      <NoteList />
    </main>
  );
}
