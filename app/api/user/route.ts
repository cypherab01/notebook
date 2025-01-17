import connect from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";

export async function POST(request: Request)
{
    try {
        await connect();
    const  {email, name, imageurl} = await request.json();
    await User.create({email, name, imageurl});
    return new NextResponse("User registered successfully.", { status: 201});
    } catch (error:any) {
        return new NextResponse("Error: " + error.message);
    }
}