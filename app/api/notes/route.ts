import connect from "@/lib/db";
import Note from "@/lib/models/note";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

// get all notes from database
export const GET = async (request: Request) => {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    
    // If no query provided, return all notes
    if (!query) {
      const notes = await Note.find();
      return new NextResponse(JSON.stringify(notes), { status: 200 });
    }
    
    // If query exists, return filtered notes by title or description
    const notes = await Note.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } }
      ]
    });
    return new NextResponse(JSON.stringify(notes), { status: 200 });
  } catch (error) {
    return new NextResponse("Error while fetching notes.", { status: 500 });
  }
};


