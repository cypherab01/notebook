import connect from "@/lib/db";
import Note from "@/lib/models/note";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async (request: Request) => {
  try {
    await connect();
    const notes = await Note.find();
    return new NextResponse(JSON.stringify(notes), { status: 200 });
  } catch (error) {
    return new NextResponse("Error while fetching notes.");
  }
};

export const POST = async (request: Request) => {
  try {
    await connect();
    const body = await request.json();
    const note = new Note({ title: body.title, content: body.content });
    await note.save();
    return new NextResponse(JSON.stringify(note), { status: 201 });
  } catch (error) {
    return new NextResponse("Error while creating a note.");
  }
};

export const PATCH = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const body = await request.json();
    const { newTitle, newContent } = body;

    await connect();
    if (!id || !newTitle || !newContent) {
      return new NextResponse(
        JSON.stringify({ message: "Note ID, Title or Content not found." }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(id)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid Note ID passed." }),
        {
          status: 400,
        }
      );
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { title: newTitle, content: newContent },
      { new: true }
    );

    if (!updatedNote) {
      return new NextResponse(JSON.stringify({ message: "Note not found." }), {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "Note has been updated successfully." }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating note.", {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await connect();
    if (!id) {
      return new NextResponse(
        JSON.stringify({ message: "Note ID not found." }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(id)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid Note ID passed." }),
        {
          status: 400,
        }
      );
    }

    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return new NextResponse(JSON.stringify({ message: "Note not found." }), {
        status: 404,
      });
    }
    return new NextResponse(
      JSON.stringify({ message: "Note has been deleted successfully." }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in deleting note.", {
      status: 500,
    });
  }
};
