import React from "react";
import Image from "next/image";

const Page = () => {
  return (
    <div
      className="min-h-screen flex flex-col bg-soft_brown-100 text-dark_moss_green-400 select-none"
      style={{
        backgroundColor: "#fefaf4",
        backgroundImage: "url('/patterns/bones.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "200px",
      }}
    >
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-soft_brown-300 shadow-inner">
        <Image
          src="/Isotipo.png"
          alt="Señor Sabueso"
          width={180}
          height={38}
          priority
          className="mx-auto"
        />
        <h1 className="text-6xl font-extrabold mb-6 leading-tight text-dark_moss_green-400">
          Señor Sabueso
        </h1>
        <p className="text-2xl max-w-2xl mb-12 text-dark_moss_green-400 font-medium">
          El alimento favorito de tu mascota, en la puerta de tu casa. Fácil y rápido.
        </p>
        <div className="relative w-full max-w-4xl h-72 bg-soft_brown-200 rounded-xl border-2 border-dashed border-dark_moss_green-400 overflow-hidden shadow-xl">
          <Image
            src="/landing-image.png"
            alt="Señor Sabueso"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Características */}
      <section className="px-6 py-20 max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
        <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <h3 className="text-2xl font-bold mb-3 text-dark_moss_green-400">Comprás por Whatsapp</h3>
          <p className="text-dark_moss_green-400">
            Tenemos gran variedad de alimentos para tus mascotas, contactanos y te ayudamos!
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <h3 className="text-2xl font-bold mb-3 text-dark_moss_green-400">
            Repetir el pedido es fácil!
          </h3>
          <p className="text-dark_moss_green-400">
            Cuando te quedás sin, escaneás el código QR de la bolsa y ya nos pedís de vuelta!
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <h3 className="text-2xl font-bold mb-3 text-dark_moss_green-400">Entrega Eficiente</h3>
          <p className="text-dark_moss_green-400">
            Nos avisás cuándo te queda cómodo recibir el pedido y te lo entregamos en la puerta de
            tu casa.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center text-center py-20 bg-dark_moss_green-400 text-white shadow-inner">
        <h2 className="text-4xl font-bold mb-4">¿Necesitás alimento para tu mascota?</h2>
        <p className="mb-10 text-xl font-light">Escribinos directamente por WhatsApp.</p>
        <a
          href="https://wa.me/5491138991367?text=Hola%20Señor%20Sabueso!%20Me%20gustaría%20hacerle%20una%20consulta!"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="px-6 py-3 bg-white text-dark_moss_green-400 font-semibold rounded-lg shadow hover:bg-gray-100 transition">
            Ir a WhatsApp
          </button>
        </a>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-dark_moss_green-400 bg-soft_brown-200 border-t border-soft_brown-300">
        <div className="flex justify-center gap-4 mb-4">
          <a
            href="https://www.instagram.com/srsabueso/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex items-center gap-2 text-dark_moss_green-400 hover:opacity-75 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.25 2a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
            </svg>
            <span className="text-base font-medium">Instagram</span>
          </a>
        </div>

        <p>© {new Date().getFullYear()} Señor Sabueso. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Page;
