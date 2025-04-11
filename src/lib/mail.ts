import { Resend } from "resend";

const resend = new Resend(process.env.EMAIL_SERVER_PASSWORD!);

export async function sendVerificationEmail(email: string, verifyUrl: string) {
  await resend.emails.send({
    from: 'Señor Sabueso <no-reply@srsabueso.com>', // Tiene que estar verificado en Resend
    to: email,
    subject: "Verificá tu cuenta",
    html: `
      <h1>Bienvenido</h1>
      <p>Hacé clic en el siguiente enlace para verificar tu cuenta:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>Este enlace expirará en 15 minutos.</p>
    `,
  });
}
