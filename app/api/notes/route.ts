import connect from "@/lib/db";
import Note from "@/models/note.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async (request: NextRequest) => {
  try {
    await connect();
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized access", data: [] },
        { status: 401 }
      );
    }

    const userId = (
      jwt.verify(token, process.env.TOKEN_SECRET!) as { id: string }
    ).id;
    const userNotes = await Note.find({ user: userId });

    return NextResponse.json(
      {
        message: "Notes fetched successfully",
        data: userNotes || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in notes route:", error);
    return NextResponse.json(
      { message: "Internal server error", data: [] },
      { status: 500 }
    );
  }
};
