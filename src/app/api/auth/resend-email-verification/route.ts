// src/app/api/auth/resend-email-verification/route.ts

import { NextRequest, NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/mail"; // Asegúrate de que tienes esta función configurada correctamente

export async function POST(req: NextRequest) {
  try {
    // Obtener email desde el cuerpo de la solicitud
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Correo electrónico es necesario." }, { status: 400 });
    }

    // Generar la URL de verificación (debe ser dinámica según la lógica)
    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?email=${email}`;

    // Enviar el correo de verificación
    await sendVerificationEmail(email, verifyUrl);

    return NextResponse.json({ message: "Correo de verificación reenviado con éxito." }, { status: 200 });
  } catch (error) {
    console.error("Error reenviando correo de verificación:", error);
    return NextResponse.json({ message: "Error al reenviar el correo de verificación", error }, { status: 500 });
  }
}
