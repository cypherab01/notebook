import connect from "@/lib/db";
import Note from "@/lib/models/note";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

// get all notes from database
export const GET = async (request: Request) => {
  try {
    await connect();
    const notes = await Note.find();
    return new NextResponse(JSON.stringify(notes), { status: 200 });
  } catch (error) {
    return new NextResponse("Error while fetching notes.");
  }
};
