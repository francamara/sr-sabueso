"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../../../models";

type Brand = { id: number; name: string };
type Animal = { id: number; name: string };

const tableHeaders = [
  { key: "description", label: "Descripción" },
  { key: "weight", label: "Peso (kg)" },
  { key: "extra_weight", label: "Kg Gratis" },
  { key: "retail_price", label: "Precio Público" },
  { key: "stock", label: "Stock" },
  { key: "sku", label: "Código Interno" },
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);

  const [barcode, setBarcode] = useState("");
  const [searchSku, setSearchSku] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedAnimalId, setSelectedAnimalId] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!Array.isArray(products)) return;

    let filtered = [...products];

    if (barcode.trim()) {
      filtered = filtered.filter((p) =>
        p.barcode?.toLowerCase().includes(barcode.toLowerCase())
      );
    }

    if (searchSku.trim()) {
      filtered = filtered.filter((p) =>
        p.sku?.toLowerCase().includes(searchSku.toLowerCase())
      );
    }

    if (selectedBrandId) {
      filtered = filtered.filter((p) => p.brand_id === parseInt(selectedBrandId));
    }

    if (selectedAnimalId) {
      filtered = filtered.filter((p) => p.animal_id === parseInt(selectedAnimalId));
    }

    setFilteredProducts(filtered);
  }, [barcode, searchSku, selectedBrandId, selectedAnimalId, products]);

  const fetchInitialData = async () => {
    try {
      const [productsRes, attributesRes] = await Promise.all([
        axios.get<Product[]>("/api/products"),
        axios.get("/api/products/attributes"),
      ]);
      setProducts(productsRes.data);
      setFilteredProducts(productsRes.data);
      setBrands(attributesRes.data.brands);
      setAnimals(attributesRes.data.animals);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-soft_brown-100 text-dark_moss_green-400">
        <div className="text-xl font-semibold animate-pulse">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 px-6 font-[family-name:var(--font-geist-sans)]">
      {/* Search Section */}
      <div className="flex flex-wrap gap-4 w-full bg-gray-100 p-4 rounded-md shadow-sm text-gray-800">
        <input
          type="text"
          className="p-2 border rounded-md text-gray-800"
          placeholder="Código de Barras"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded-md text-gray-800"
          placeholder="SKU"
          value={searchSku}
          onChange={(e) => setSearchSku(e.target.value)}
        />
        <select
          value={selectedBrandId}
          onChange={(e) => setSelectedBrandId(e.target.value)}
          className="p-2 border rounded-md text-gray-800"
          aria-label="Filtrar por marca"
          title="Filtrar por marca"
        >
          <option value="">Marca</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <select
          value={selectedAnimalId}
          onChange={(e) => setSelectedAnimalId(e.target.value)}
          className="p-2 border rounded-md"
          aria-label="Filtrar por animal"
          title="Filtrar por animal"
        >
          <option value="">Animal</option>
          {animals.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        {/* Botón para limpiar filtros */}
        <button
          onClick={() => {
            setBarcode("");
            setSearchSku("");
            setSelectedBrandId("");
            setSelectedAnimalId("");
            setFilteredProducts(products); // Vuelve a mostrar todos los productos
          }}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
          aria-label="Limpiar filtros"
          title="Limpiar filtros"
        >
          ❌ Limpiar filtros
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto w-full mt-6">
        {filteredProducts.length > 0 ? (
          <table className="table-auto w-full text-black border-collapse">
            <thead className="bg-dark_moss_green-500 text-white">
              <tr>
                {tableHeaders.map((header) => (
                  <th key={header.key} className="p-3 text-left">
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  {tableHeaders.map((header) => (
                    <td key={header.key} className="p-3 border-t">
                      {header.key === "retail_price" && typeof product[header.key as keyof Product] === "number"
                        ? `$${(product[header.key as keyof Product] as number).toFixed(2)}`
                        : product[header.key as keyof Product]?.toString() ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 mt-8">No hay productos para mostrar</div>
        )}
      </div>
    </div>
  );
}
