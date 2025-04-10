import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    console.log("🔍 Raw body received:", rawBody);

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("❌ Error parsing JSON:", parseError);
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { email, username, password } = body;
    console.log("📦 Parsed body:", { email, username, password });

    if (!email || !username || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          phone_number: '123456',
          role: { connect: { id: 1 } },
        },
      });
      
      console.log("🆕 New user created:", newUser);
      
      return NextResponse.json({ user: newUser }, { status: 201 });
      
  } catch (error: any) {
    console.error("🔥 Unexpected error in /api/register:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
