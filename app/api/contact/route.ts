import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, message, social } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const newContact = await Contact.create({
      name,
      email,
      message,
      social,
    });

    return NextResponse.json({
      success: true,
      message: "Message saved successfully",
      data: newContact,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
