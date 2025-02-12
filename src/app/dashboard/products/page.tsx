"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../../../models";

const tableHeaders = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "weight", label: "Weight" },
  { key: "extraWeight", label: "Kg Gratis" },
  { key: "retailPrice", label: "Precio Publico" },
  { key: "stock", label: "Stock" },
  { key: "uniqueCode", label: "Codigo Interno" },
  { key: "button", label: "Agregar Pedido" }
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [phoneNumber, setPhoneNumber] = useState<number>(1);
  const [streetAddress, setStreetAddress] = useState<string>("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleOrderSubmit = () => {
    handleCloseModal();
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-[90%]">
        <h1 className="text-dark_moss_green-500 text-2xl font-bold">STOCK</h1>

        {/* Product Table */}
        <div className="overflow-x-auto w-full">
          <table className="table w-full text-black">
            <thead>
              <tr>
                {tableHeaders.map((header) => (
                  <th key={header.key}>{header.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  {tableHeaders.map((header) => (
                    <td key={header.key}>
                      {header.key === "button" ? (
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="px-4 py-2 bg-moss_green-400 hover:bg-moss_green-500 text-white font-bold rounded"
                        >
                          Agregar
                        </button>
                      ) : header.key === "weight" ? (
                        `${product[header.key as keyof Product]} kg`
                      ) : (
                        product[header.key as keyof Product]?.toString() ?? ""
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal Component */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-gray-700">
            <h2 className="text-xl font-bold mb-4">Nuevo Pedido</h2>
            <p className="text-gray-700">{selectedProduct.name}</p>
            <p>Kilos: {selectedProduct.weight}kg</p>
            <p>Kilos gratis: {selectedProduct.extraWeight}kg</p>

            <label className="block text-gray-600 mt-4">Cantidad:</label>
            <input
              title="quantity"
              type="number"
              className="w-full p-2 border rounded-md"
              value={quantity}
              min={1}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val < 1) return; // Prevents negative values
                setQuantity(val);
              }}
            />
            <label className="block text-gray-600 mt-4">Numero de telefono:</label>
            <input
              title="streetAddress"
              type="text"
              className="w-full p-2 border rounded-md"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />

            <label className="block text-gray-600 mt-4">Direccion:</label>
              <input
                title="phoneNumber"
                type="k"
                className="w-full p-2 border rounded-md"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(Number(e.target.value))}
              />

            <div className="flex justify-end mt-6">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button className="text-white px-4 py-2 rounded-md bg-moss_green-400 hover:bg-moss_green-500" onClick={handleOrderSubmit}>
                Confirmar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
