"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

const CreateNote = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/note`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ title, content }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Note created successfully");
        setTitle("");
        setContent("");
        setTimeout(() => {
          router.push("/mynotes");
          router.refresh();
        }, 1000);
      } else {
        toast.error(data.message || "Failed to create note");
      }
    } catch (error) {
      toast.error("Error creating note");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Toaster richColors position="top-center" />
      <h1 className="text-2xl font-bold mb-4">Create Note</h1>
      <div className="space-y-4">
        <Label>
          Title:
          <input
            type="text"
            className="w-full p-2 py-4 ring-1 my-4 ring-primary-foreground rounded-md"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </Label>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/mynotes")}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateNote;
