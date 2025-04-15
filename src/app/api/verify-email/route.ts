import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { isAfter } from "date-fns";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    const verificationToken = await prisma.verificationToken.findUnique({ where: { token } });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    if (isAfter(new Date(), verificationToken.expires)) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
