"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

const EditNote = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [noteId, setNoteId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    const fetchNote = async () => {
      const { id } = await params;
      setNoteId(id);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/note?id=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // This will send the cookies automatically
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (res.ok && data.data) {
          if (isMounted) {
            // Only update state if mounted
            setTitle(data.data.title || "");
            setContent(data.data.content || "");
          }
        } else {
          toast.error(data.message || "Failed to fetch note");
          router.push("/mynotes");
        }
      } catch (error) {
        toast.error("Error fetching note");
        router.push("/mynotes");
      }
    };

    fetchNote();

    return () => {
      isMounted = false; // Cleanup function to set isMounted to false
    };
  }, [params, router]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/note?id=${noteId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // This will send the cookies automatically
          body: JSON.stringify({ newTitle: title, newContent: content }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Note updated successfully");
        router.push("/mynotes");
      } else {
        toast.error(data.message || "Failed to update note");
      }
    } catch (error) {
      toast.error("Error updating note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Toaster richColors position="top-center" />
      <h1 className="text-2xl font-bold mb-4">Edit Note</h1>
      <div className="space-y-4">
        <Label>
          Title:
          <input
            type="text"
            className="w-full p-2 py-4 ring-1 my-4 ring-primary-foreground rounded-md"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Label>

        <Label>
          Content:
          <textarea
            className="w-full p-2 py-4 ring-1 my-4 ring-primary-foreground rounded-md"
            rows={5}
            placeholder="Note description"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Label>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/mynotes")}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditNote;
