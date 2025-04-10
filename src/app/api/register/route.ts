import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import  { randomBytes } from "crypto";
import { addMinutes } from "date-fns";
import { sendVerificationEmail } from "@/lib/mail"; // tenés que tener esta función creada


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


      const token = randomBytes(32).toString("hex");
      const expires = addMinutes(new Date(), 15); // Token válido por 15 minutos
      
      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      });

      const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}&email=${email}`;
      await sendVerificationEmail(email, verifyUrl);
      
      return NextResponse.json({ user: newUser }, { status: 201 });

  } catch (error: unknown) {
    console.error("🔥 Unexpected error in /api/register:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
