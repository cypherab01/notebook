import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
import connect from "@/lib/db";
import User from "@/models/user.model";

export async function POST(request: NextRequest) {
  try {
    connect();
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    // Validate username
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,19}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json({
        error:
          "Username must be 3-20 characters long, start with a letter, and contain only letters and numbers",
        status: 400,
      });
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        error: "Please enter a valid email address",
        status: 400,
      });
    }

    // Validate password
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z\d\W]{8,}$/;
    if (!passwordRegex.test(password)) {
      let error = "Password must be at least 8 characters long and contain:";
      if (!/(?=.*[A-Za-z])/.test(password)) {
        error += "\n- At least one letter";
      }
      if (!/(?=.*\d)/.test(password)) {
        error += "\n- At least one number";
      }
      if (!/(?=.*[^A-Za-z0-9])/.test(password)) {
        error += "\n- At least one special character";
      }
      if (password.length < 8) {
        error += "\n- Minimum 8 characters";
      }
      return NextResponse.json({
        error,
        status: 400,
      });
    }

    //check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "User already exists, please login..." },
        { status: 400 }
      );
    }

    //check if username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return NextResponse.json(
        { error: "Username already exists, please try another one..." },
        { status: 400 }
      );
    }

    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    //send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    // Extract email domain
    const emailDomain = email.split("@")[1];

    // Get verification website link based on domain
    let verificationLink = "";
    if (emailDomain === "gmail.com") {
      verificationLink = "https://gmail.com";
    } else if (emailDomain === "outlook.com" || emailDomain === "hotmail.com") {
      verificationLink = "https://outlook.live.com";
    } else if (emailDomain === "yahoo.com") {
      verificationLink = "https://mail.yahoo.com";
    } else {
      verificationLink = `https://${emailDomain}`;
    }

    return NextResponse.json({
      message: "User created successfully, please verify your email...",
      success: true,
      savedUser,
      emailProvider: verificationLink,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed while creating user..." },
      { status: 500 }
    );
  }
}
