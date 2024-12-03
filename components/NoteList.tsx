import Link from "next/link";
import Delete from "./Delete";
import Edit from "./Edit";

const NoteList = async () => {
  try {
    let response = await fetch("http://localhost:3000/api/notes");
    let notes = await response.json();
    const noteLength = notes.length;

    // Sort notes based on updated date first
    notes.sort(
      (a: any, b: any) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return (
      <ul>
        {noteLength === 0 ? (
          <div className="flex items-center justify-start my-8">
            <p>
              No notes found. Create your first note{" "}
              <Link href={"/create"} className="text-blue-500">
                here.
              </Link>
            </p>{" "}
          </div>
        ) : (
          notes.map((note: any) => (
            <li key={note._id}>
              <div className="p-2 ring-1 ring-primary-foreground my-8 shadow-md rounded-sm hover:shadow-xl">
                <div className="flex items-start justify-center flex-col ">
                  <h2 className="text-xl mb-2">{note.title}</h2>
                  <p>{note.content}</p>
                  <div className="text-muted-foreground text-sm mt-4 flex items-start justify-center flex-col">
                    <p>
                      Created on:{" "}
                      {new Date(note.createdAt).toLocaleString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <p>
                      Last updated on:{" "}
                      {new Date(note.updatedAt).toLocaleString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>
                <div
                  id="btns"
                  className="flex items-center justify-end gap-4 my-4"
                >
                  {/* <Edit id={note.id} /> */}
                  {note._id && <Edit id={note._id} />}
                  <Delete id={note._id} />
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    );
  } catch (error) {
    return (
      <div className="p-2 my-8 shadow-md rounded-sm hover:shadow-xl text-destructive">
        <div className="flex items-center justify-center">
          <h2 className="text-xl mb-2">
            Error fetching notes. Failed to connect to the database...
          </h2>
        </div>
      </div>
    );
  }
};

export default NoteList;
