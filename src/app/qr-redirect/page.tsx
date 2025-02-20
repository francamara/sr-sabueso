"use client";

import Image from "next/image";
import { Bungee } from "next/font/google";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@prisma/client";
import axios from "axios";

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400", // Regular weight
});


function generateWhatsAppLink(productName?: string) {
  const baseUrl = "https://api.whatsapp.com/send?phone=541138991367";
  const defaultMessage = "Hola, Señor Sabueso! Me gustaría hacerle una consulta.";
  const productMessage = productName ? `Hola, necesito más ${productName}!` : defaultMessage;

  return `${baseUrl}&text=${encodeURIComponent(productMessage)}`;
}

export default function QrRedirect() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId"); // Get productId from URL params

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axios.get<Product>(`/api/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (product) { // Wait until product is fetched
      const timer = setTimeout(() => {
        const whatsappUrl = generateWhatsAppLink(product.description);
        window.location.href = whatsappUrl;
      }, 3500);
  
      return () => clearTimeout(timer);
    }
  }, [product]); // This will now run only when product is updated

  return (
    <div className={`${bungee.className} w-full h-screen bg-soft_brown-300 flex align-middle justify-center flex-col select-none`}>
      <div className="flex align-middle justify-center m-auto">
        <div className="text-center text-dark_moss_green-100">
          <Image src="/Isotipo.png" className="m-auto" alt="Señor Sabueso" width={180} height={38} priority />
          <h1 className="text-4xl font-bold mt-4 text-dark_moss_green-600">Señor Sabueso</h1>
  
          {/* Mostrar un texto distinto si existe un producto */}
          <h2 className="text-dark_moss_green-600 mt-4 text-3xl">
            {product
              ? `Estás consultando por: ${product.description}`
              : "El alimento favorito de tu mascota, con envío a domicilio."
            }
          </h2>
  
          {/* Nuevo Indicador de Carga */}
          <div className="mt-6 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-t-soft_brown-200 rounded-full animate-spin border-dark_moss_green-600"></div>
          </div>
  
          {/* Texto de redirección */}
          <p className="mt-4 text-2xl animate-pulse text-dark_moss_green-600">
            Redirigiendo a WhatsApp...
          </p>
        </div>
      </div>
    </div>
  );
  
  
}
