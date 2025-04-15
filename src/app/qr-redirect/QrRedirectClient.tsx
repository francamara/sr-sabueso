// app/qr-redirect/page.tsx
import { Suspense } from "react";
import QrRedirectClient from "./QrRedirectClient";

export default function QrRedirectPage() {
  return (
    <Suspense fallback={<div>Cargando QR Redirect...</div>}>
      <QrRedirectClient />
    </Suspense>
  );
}
