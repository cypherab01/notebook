"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const CreateNote = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      if (response.ok) {
        // const newNote = await response.json();
        // console.log("New note created:", newNote);
        handleClear();
        toast({
          variant: "default",
          title: "Note Created",
          description: "Your note has been created successfully!",
        });

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        console.error("Failed to create note:", await response.text());
      }
    } catch (error) {
      console.error("Error while creating note:", error);
    }
  };

  const handleClear = () => {
    setTitle("");
    setContent("");
  };
  return (
    <div>
      <Label>
        Title:
        <input
          type="text"
          className="w-full p-2 py-4 ring-1 my-4 ring-primary-foreground"
          placeholder="Note title"
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
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      </Label>
      <Button variant={"outline"} onClick={handleSubmit}>
        Create
      </Button>
    </div>
  );
};

export default CreateNote;
