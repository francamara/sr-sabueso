"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../../../models";

const tableHeaders = [
  // { key: "id", label: "#" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "weight", label: "Weight" },
  // { key: "listPrice", label: "List Price" },
  { key: "retailPrice", label: "Retail Price" },
  { key: "stock", label: "Stock" },
  { key: "barcode", label: "Barcode" }
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  // const [formData, setFormData] = useState<Partial<Product>>({
  //   name: "",
  //   description: "",
  //   weight: 0,
  //   listPrice: 0,
  //   retailPrice: 0,
  //   stock: 0,
  //   barcode: "",
  // });

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

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     await axios.post("/api/products", formData);
  //     fetchProducts();
  //     setFormData({
  //       name: "",
  //       description: "",
  //       weight: 0,
  //       listPrice: 0,
  //       retailPrice: 0,
  //       stock: 0,
  //       barcode: "",
  //     });
  //   } catch (error) {
  //     console.error("Error adding product:", error);
  //   }
  // };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-[90%]">
        <h1 className="text-dark_moss_green-500 text-2xl font-bold">STOCK</h1>

        {/* Product Form
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-gray-100 rounded-md shadow-md">
          {Object.keys(formData).map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={formData[key as keyof Product] as string}
              onChange={handleChange}
              className="p-2 border rounded-md"
              required
            />
          ))}
          <button type="submit" className="bg-office_green-500 text-white p-2 rounded-md hover:bg-office_green-600">Add Product</button>
        </form> */}

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
                  {tableHeaders.map((header) => {
                    const value = product[header.key as keyof Product];

                    return (
                      <td key={header.key}>
                        {Array.isArray(value) 
                          ? value.map((item) => item.distributorId).join(", ") // Mostrar IDs de distribuidores
                          : header.key === "weight"
                          ? `${value} kg` // Agregar "kg" si es weight
                          : value?.toString() ?? ""} {/* Convertir cualquier otro valor en string */}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
