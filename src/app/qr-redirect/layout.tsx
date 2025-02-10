import "../globals.css";

export default function QrRedirectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="w-full h-full">
      <body className="bg-white text-black w-full h-full">
        {children}
      </body>
    </html>
  );
}
