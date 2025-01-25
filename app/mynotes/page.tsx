import Link from "next/link";
import connect from "@/lib/db";
import Delete from "@/components/ui/delete-button";
import Edit from "@/components/ui/edit-button";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const mynotes = async () => {
  try {
    await connect();
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return (
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">Please login to view your notes</p>
          </CardContent>
        </Card>
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
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-start gap-4 md:gap-0 md:items-center flex-col md:flex-row">
          <h1 className="text-3xl font-bold">My Notes</h1>
          <Button asChild variant="default">
            <Link href={"mynotes/create"}>Create Note</Link>
          </Button>
        </div>

        {noteLength === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No notes found. Create your first note to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {parsedNotes.map((note: any) => (
              <Card key={note._id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{note.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{note.content}</p>
                  <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                    <p>
                      Created:{" "}
                      {new Date(note.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <p>
                      Updated:{" "}
                      {new Date(note.updatedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 mt-auto select-none">
                  {note._id && <Edit id={note._id} />}
                  <Delete id={note._id} />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.log("Error fetching notes", error);
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">
            Failed to connect to the database. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }
};
export default mynotes;
