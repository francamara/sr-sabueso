import React from "react";
import Image from "next/image";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-soft_brown-100 text-dark_moss_green-400">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-soft_brown-300 shadow-inner">
        <Image src="/Isotipo.png" alt="Señor Sabueso" width={180} height={38} priority className="mx-auto" />
        <h1 className="text-6xl font-extrabold mb-6 leading-tight text-dark_moss_green-400">
          Señor Sabueso
        </h1>
        <p className="text-2xl max-w-2xl mb-12 text-dark_moss_green-400 font-medium">
          El alimento favorito de tu mascota, en la puerta de tu casa. Fácil y rápido.
        </p>
        <div className="relative w-full max-w-4xl h-72 bg-soft_brown-200 rounded-xl border-2 border-dashed border-dark_moss_green-400 overflow-hidden">
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
        <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-2xl font-bold mb-3 text-dark_moss_green-400">Comprás por Whatsapp</h3>
          <p className="text-dark_moss_green-400">Tenemos gran variedad de alimentos para tus mascotas, contactanos y te ayudamos!</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-2xl font-bold mb-3 text-dark_moss_green-400">Repetir el pedido es fácil!</h3>
          <p className="text-dark_moss_green-400">Cuando te quedas sin, escaneas el código QR de la bolsa y ya nos pedis de vuelta!</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-2xl font-bold mb-3 text-dark_moss_green-400">Entrega Eficiente</h3>
          <p className="text-dark_moss_green-400">Nos avisas cuando te queda cómodo recibir el pedido y te lo entregamos la puerta de tu casa.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center text-center py-20 bg-dark_moss_green-400 text-white">
        <h2 className="text-4xl font-bold mb-4">¿Necesitas alimento para tu mascota?</h2>
        <p className="mb-10 text-xl font-light">Escribinos directamente por WhatsApp.</p>
        <a
          href="https://wa.me/5491138991367?text=Hola%20Señor%20Sabueso!%20Me%20gustaria%20hacerle%20una%20consulta!"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="px-6 py-3 bg-white text-dark_moss_green-400 font-semibold rounded-lg shadow hover:bg-gray-100 transition">
            Ir a WhatsApp
          </button>
        </a>
      </section>


      {/* Footer */}
      <footer className="py-6 text-center text-sm text-dark_moss_green-400 bg-soft_brown-200">
        © {new Date().getFullYear()} Señor Sabueso. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Page;
