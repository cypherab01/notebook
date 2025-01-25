import connect from "@/lib/db";
import Note from "@/models/note.model";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import jwt from "jsonwebtoken";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async (request: NextRequest) => {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get("id");

    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    if (!noteId) {
      return NextResponse.json(
        { message: "Note ID not found." },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(noteId)) {
      return NextResponse.json(
        { message: "Invalid Note ID passed." },
        { status: 400 }
      );
    }

    const note = await Note.findOne({ _id: noteId, user: userId });
    if (!note) {
      return NextResponse.json(
        { message: "Note not found or not authorized." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Note fetched successfully", data: note },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error while fetching note." },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    await connect();
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const userId = (
      jwt.verify(token, process.env.TOKEN_SECRET!) as { id: string }
    ).id;

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    const note = new Note({
      title,
      content,
      user: userId,
    });

    await note.save();

    return NextResponse.json(
      {
        message: "Note created successfully",
        data: note,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { message: "Error while creating note" },
      { status: 500 }
    );
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

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
      { _id: new ObjectId(id), user: userId },
      { title: newTitle, content: newContent },
      { new: true }
    );

    if (!updatedNote) {
      return new NextResponse(
        JSON.stringify({ message: "Note not found or not authorized." }),
        {
          status: 404,
        }
      );
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

export const DELETE = async (request: NextRequest) => {
  try {
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

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

    const deletedNote = await Note.findOneAndDelete({ _id: id, user: userId });
    if (!deletedNote) {
      return new NextResponse(
        JSON.stringify({ message: "Note not found or not authorized." }),
        {
          status: 404,
        }
      );
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
