'use client';

import { useEffect, useState } from "react";
import axios from "axios";

type Brand = { id: number; name: string };
type Animal = { id: number; name: string };

type Product = {
  id: number;
  name: string;
  description: string;
  weight: number;
  extra_weight: number;
  retail_price: number;
  stock: number;
  sku: string;
  barcode: string;
  brand: Brand;
  animal: Animal;
};

const tableHeaders = [
  { key: "name", label: "Nombre" },
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
  const [barcode, setBarcode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchSku, setSearchSku] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState("");
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

    if (searchName.trim()) {
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchSku.trim()) {
      filtered = filtered.filter((p) =>
        p.sku?.toLowerCase().includes(searchSku.toLowerCase())
      );
    }

    if (selectedBrand) {
      filtered = filtered.filter((p) => p.brand.id === parseInt(selectedBrand));
    }

    if (selectedAnimal) {
      filtered = filtered.filter((p) => p.animal.id === parseInt(selectedAnimal));
    }

    setFilteredProducts(filtered);
  }, [barcode, searchName, searchSku, selectedBrand, selectedAnimal, products]);

  const fetchInitialData = async () => {
    try {
      const [productsRes, attributesRes] = await Promise.all([
        axios.get("/api/products"),
        axios.get("/api/products/attributes"),
      ]);
      setProducts(productsRes.data);
      setFilteredProducts(productsRes.data);
      setBrands(attributesRes.data.brands || []);
      setAnimals(attributesRes.data.animals || []);
    } catch (error) {
      console.error("Error fetching data:", error);
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
      <div className="flex flex-wrap gap-4 w-full bg-gray-100 p-4 rounded-md shadow-sm">
        <input
          type="text"
          className="p-2 border rounded-md"
          placeholder="Buscar por código de barras"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded-md"
          placeholder="Buscar por nombre"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded-md"
          placeholder="Buscar por SKU"
          value={searchSku}
          onChange={(e) => setSearchSku(e.target.value)}
        />
        <select
          className="p-2 border rounded-md"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          title="Marca"
        >
          <option value="">Filtrar por Marca</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded-md"
          value={selectedAnimal}
          onChange={(e) => setSelectedAnimal(e.target.value)}
          title="animal"
        >
          <option value="">Filtrar por Animal</option>
          {animals.map((animal) => (
            <option key={animal.id} value={animal.id}>
              {animal.name}
            </option>
          ))}
        </select>
      </div>

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
