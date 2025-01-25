import Link from "next/link";
import connect from "@/lib/db";
import Delete from "@/components/ui/delete-button";
import Edit from "@/components/ui/edit-button";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const mynotes = async () => {
  try {
    await connect();
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return (
        <div className="p-2 my-8 shadow-md rounded-sm hover:shadow-xl text-destructive">
          <div className="flex items-center justify-center">
            <h2 className="text-xl mb-2">Please login to view your notes</h2>
          </div>
        </div>
      );
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as {
      id: string;
    };
    const userId = decodedToken.id;

    const res = await fetch(`${process.env.API_URL}/notes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      cache: "no-store",
    });

    const notes = await res.json();
    const parsedNotes = notes.data || [];
    const noteLength = parsedNotes.length;

    // Sort notes based on updated date first
    if (noteLength > 0) {
      parsedNotes.sort(
        (a: any, b: any) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    return (
      <ul>
        <Link href={"mynotes/create"} className="text-blue-500">
          Create Note
        </Link>
        {noteLength === 0 ? (
          <div className="flex items-center justify-start my-8">
            <p>It's surprising to see you here, but no notes found.</p>
          </div>
        ) : (
          parsedNotes.map((note: any) => (
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
    console.log("Error fetching notes", error);
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
export default mynotes;
