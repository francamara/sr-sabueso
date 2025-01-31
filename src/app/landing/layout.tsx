import "../globals.css";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="w-full h-full">
      <body className="bg-white text-black w-full h-full">
        {children} {/* Solo renderiza el contenido sin sidebar ni header */}
      </body>
    </html>
  );
}
