// app/api/request-verification/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.verificationToken.create({
    data: { identifier: email, token, expires },
  });

  const verifyUrl = `${SITE_URL}/api/verify-email?token=${token}`;

  await fetch(`${SITE_URL}/api/send-email`, {
    method: "POST",
    body: JSON.stringify({
      to: email,
      subject: "Verificá tu cuenta",
      html: `<p>Hacé clic en el siguiente enlace para verificar tu email:</p><a href="${verifyUrl}">${verifyUrl}</a>`,
    }),
    headers: { "Content-Type": "application/json" },
  });

  return NextResponse.json({ message: "Verification email sent" });
}
