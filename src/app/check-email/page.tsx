import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-soft_brown-100 text-dark_moss_green-400 px-6 text-center">
      <Image src="/Isotipo.png" alt="Señor Sabueso" width={100} height={100} className="mb-6" />

      <h1 className="text-4xl font-bold mb-4">¡Revisá tu email!</h1>
      <p className="max-w-md text-lg mb-8">
        Te enviamos un correo para verificar tu cuenta. Hacé clic en el enlace para activar tu usuario y comenzar a pedirle alimento a tu mascota 🐶
      </p>

      <div className="flex flex-col gap-4 items-center">
        {/* Botón para volver al inicio */}
        <Link href="/">
          <button className="px-6 py-3 bg-dark_moss_green-400 text-white font-semibold rounded-lg shadow hover:opacity-90 transition">
            Volver al inicio
          </button>
        </Link>

        {/* Botón solo visible en mobile */}
        <a
          href="mailto:"
          className="md:hidden inline-block px-6 py-3 bg-white text-dark_moss_green-400 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
        >
          Abrir app de Email
        </a>
      </div>
    </div>
  );
};
