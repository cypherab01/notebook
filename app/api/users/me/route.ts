import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as {
      id: string;
      username: string;
      email: string;
    };

    return NextResponse.json(
      {
        message: "User data fetched successfully",
        data: {
          username: decodedToken.username,
          email: decodedToken.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching user data" },
      { status: 500 }
    );
  }
}
