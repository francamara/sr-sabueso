"use client";

import Image from "next/image";
import { Bungee } from "next/font/google";
import { useEffect } from "react";

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400", // Regular weight
});


export default function LandingMobile() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "https://api.whatsapp.com/send?phone=541138991367&text=Hola%20Se%C3%B1or%20Sabueso!%20Me%20gustaria%20hacerle%20una%20consulta!";
    }, 2600);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className={`${bungee.className} w-full h-screen bg-soft_brown-300 flex align-middle justify-center flex-col select-none`}>
      <div className="flex align-middle justify-center m-auto">
        <div className="text-center text-dark_moss_green-100">
          <Image src="/Isotipo.png" className="m-auto" alt="Señor Sabueso" width={180} height={38} priority />
          <h1 className="text-white text-2xl font-bold mt-4 text-dark_moss_green-600">Señor Sabueso</h1>
          <h2 className="text-dark_moss_green-600 mt-4">
            El alimento favorito de tu mascota, con envio a domicilio.
          </h2>
          
          {/* Nuevo Indicador de Carga */}
          <div className="mt-6 flex justify-center items-center ">
            <div className="w-10 h-10 border-4 border-t-soft_brown-200 rounded-full animate-spin border-dark_moss_green-600"></div>
          </div>
          
          {/* Texto de redirección */}
          <p className="text-white text-lg mt-4 animate-pulse text-dark_moss_green-600">
            Redirigiendo a WhatsApp...
          </p>
        </div>
      </div>
    </div>
  );
}
