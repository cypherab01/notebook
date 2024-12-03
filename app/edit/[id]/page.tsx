"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React from "react";

const EditNote = ({ params }: { params: Promise<{ id: string }> }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [noteId, setNoteId] = useState<string>("");

  useEffect(() => {
    const fetchNote = async () => {
      const id = await params.then((p) => p.id);
      setNoteId(id);
      try {
        const response = await fetch(`http://localhost:3000/api/note?id=${id}`);
        if (response.ok) {
          const note = await response.json();
          setTitle(note.title || ""); // Ensure title is always a string
          setContent(note.content || ""); // Ensure content is always a string
        } else {
          console.error("Failed to fetch note:", await response.text());
        }
      } catch (error) {
        console.error("Error while fetching note:", error);
      }
    };

    fetchNote();
  }, [params]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/note?id=${noteId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newTitle: title, newContent: content }),
        }
      );
      if (response.ok) {
        toast({
          variant: "default",
          title: "Note Updated",
          description: "Your note has been updated successfully!",
        });

        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        console.error("Failed to update note:", await response.text());
      }
    } catch (error) {
      console.error("Error while updating note:", error);
    }
  };

  return (
    <div>
      <Label>
        Title:
        <input
          type="text"
          className="w-full p-2 py-4 ring-1 my-4 ring-primary-foreground"
          placeholder="Note title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </Label>

      <Label>
        Content:
        <textarea
          className="w-full p-2 py-4 ring-1 my-4 ring-primary-foreground"
          rows={5}
          placeholder="Note description"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      </Label>
      <Button variant={"outline"} onClick={handleSubmit}>
        Update
      </Button>
    </div>
  );
};

export default EditNote;
