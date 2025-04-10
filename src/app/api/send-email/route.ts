// app/api/send-email/route.ts
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, html } = body;

    const data = await resend.emails.send({
      from: 'Señor Sabueso <info@srsabueso.com>', // Tiene que estar verificado en Resend
      to,
      subject,
      html,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error al enviar el email:', error);
    return NextResponse.json({ error: 'Error al enviar el email' }, { status: 500 });
  }
}
