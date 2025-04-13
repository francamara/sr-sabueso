'use client';

import { useEffect, useState } from "react";
import axios from "axios";

type Brand = { id: number; name: string };
type Animal = { id: number; name: string };

type Product = {
  id: number;
  description: string;
  weight: number;
  extra_weight: number;
  retail_price: number;
  stock: number;
  sku: string;
  barcode: string;
  brand_id: number;
  animal_id: number;
};

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
      filtered = filtered.filter(p => p.barcode.toLowerCase().includes(barcode.toLowerCase()));
    }

    if (searchSku.trim()) {
      filtered = filtered.filter(p => p.sku.toLowerCase().includes(searchSku.toLowerCase()));
    }

    if (selectedBrand) {
      filtered = filtered.filter(p => p.brand_id === parseInt(selectedBrand));
    }

    if (selectedAnimal) {
      filtered = filtered.filter(p => p.animal_id === parseInt(selectedAnimal));
    }

    setFilteredProducts(filtered);
  }, [barcode, searchSku, selectedBrand, selectedAnimal, products]);

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
      console.error("Error al cargar los datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBrandName = (brand_id: number) =>
    brands.find(b => b.id === brand_id)?.name || "-";

  const getAnimalName = (animal_id: number) =>
    animals.find(a => a.id === animal_id)?.name || "-";

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-soft_brown-100 text-dark_moss_green-400">
        <div className="text-xl font-semibold animate-pulse">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 px-6 bg-old_lace-600 text-dark_moss_green-500 font-sans">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <input
          type="text"
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-dark_moss_green-400"
          placeholder="Buscar por código de barras"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
        <input
          type="text"
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-dark_moss_green-400"
          placeholder="Buscar por SKU"
          value={searchSku}
          onChange={(e) => setSearchSku(e.target.value)}
        />
        <select
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-dark_moss_green-400"
          value={selectedBrand}
          title="Seleccionar marca"
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">Filtrar por Marca</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>
        <select
          title="Seleccionar animal"
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-dark_moss_green-400"
          value={selectedAnimal}
          onChange={(e) => setSelectedAnimal(e.target.value)}
        >
          <option value="">Filtrar por Animal</option>
          {animals.map((animal) => (
            <option key={animal.id} value={animal.id}>{animal.name}</option>
          ))}
        </select>
      </div>
  
      {/* Tabla */}
      <div className="overflow-x-auto w-full mt-8">
        {filteredProducts.length > 0 ? (
          <div className="rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <table className="min-w-full bg-white text-sm text-left text-gray-700">
              <thead className="bg-dark_moss_green-500 text-white text-sm">
                <tr>
                  <th className="p-4">Marca</th>
                  <th className="p-4">Animal</th>
                  {tableHeaders.map((header) => (
                    <th key={header.key} className="p-4">{header.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 border-t">
                      <span className="inline-block px-2 py-1 rounded-full bg-soft_brown-200 text-xs font-semibold">
                        {getBrandName(product.brand_id)}
                      </span>
                    </td>
                    <td className="p-4 border-t">
                      <span className="inline-block px-2 py-1 rounded-full bg-soft_brown-100 text-xs font-semibold">
                        {getAnimalName(product.animal_id)}
                      </span>
                    </td>
                    {tableHeaders.map((header) => (
                      <td key={header.key} className="p-4 border-t">
                        {header.key === "retail_price" && typeof product[header.key as keyof Product] === "number"
                          ? `$${(product[header.key as keyof Product] as number).toFixed(2)}`
                          : product[header.key as keyof Product]?.toString() ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8">No hay productos para mostrar</div>
        )}
      </div>
    </div>
  );
  
}
