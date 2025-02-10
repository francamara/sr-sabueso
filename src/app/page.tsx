import React from "react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-soft_brown-300">
      <h1 className="text-dark_moss_green-600 text-3xl font-bold mb-6">
        Bienvenido a Señor Sabueso
      </h1>
      <p className="text-dark_moss_green-500 text-lg mb-8">
        Pagina en construcción
      </p>

      <Link href="/dashboard">
        <button className="px-6 py-3 bg-moss_green-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-moss_green-600 transition">
          Go to Admin Dashboard
        </button>
      </Link>
    </div>
  );
};

export default Page;
