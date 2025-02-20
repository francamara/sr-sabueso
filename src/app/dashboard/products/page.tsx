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
  { key: "button", label: "Agregar Pedido" },
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [phoneNumber, setPhoneNumber] = useState<number>(0);
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [barcode, setBarcode] = useState<string>("");

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
    setPhoneNumber(0);
    setStreetAddress("");
    setQuantity(1);
  };

  const handleOrderSubmit = () => {
    handleCloseModal();
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 font-[family-name:var(--font-geist-sans)] px-6">
      {/* Barcode Input Section */}
      <div className="flex flex-wrap items-center gap-4 w-full bg-gray-100 p-4 rounded-md shadow-sm">
        <label className="text-gray-700 text-lg font-semibold whitespace-nowrap">Código de Barras:</label>
        
        <input
          tabIndex={0}
          title="barcode"
          type="number"
          className="p-2 border rounded-md flex-grow min-w-0"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
        
        <button
          className="px-4 py-2 bg-moss_green-400 hover:bg-moss_green-500 text-white font-bold rounded whitespace-nowrap"
        >
          Buscar
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto w-full mt-6">
        <table className="table-auto w-full text-black border-collapse">
          <thead className="bg-dark_moss_green-500 text-white">
            <tr>
              {tableHeaders.map((header) => (
                <th key={header.key} className="p-3 text-left">{header.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                {tableHeaders.map((header) => (
                  <td key={header.key} className="p-3 border-t">
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

      {/* Modal Component */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-gray-700">
            <h2 className="text-xl font-bold mb-4">Nuevo Pedido</h2>
            <p className="text-gray-700">{selectedProduct.name}</p>
            <p>Kilos: {selectedProduct.weight}kg</p>
            <p>Kilos gratis: {selectedProduct.extraWeight}kg</p>

            {/* Inputs Section */}
            <div className="flex flex-col gap-3 mt-4">
              <label className="text-gray-600">Cantidad:</label>
              <input
                title="quantity"
                type="number"
                className="w-full p-2 border rounded-md"
                value={quantity}
                min={1}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val < 1) return;
                  setQuantity(val);
                }}
              />

              <label className="text-gray-600">Número de Teléfono:</label>
              <input
                title="phoneNumber"
                type="number"
                className="w-full p-2 border rounded-md"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(Number(e.target.value))}
              />

              <label className="text-gray-600">Dirección:</label>
              <input
                title="streetAddress"
                type="text"
                className="w-full p-2 border rounded-md"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
              />
            </div>

            {/* Buttons */}
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
