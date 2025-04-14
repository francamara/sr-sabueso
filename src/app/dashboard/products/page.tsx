'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { formatPrice } from "@/app/utils/utils";

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

const brandColors: { [key: number]: string } = {
  1: "bg-red-200 text-red-800",
  2: "bg-blue-200 text-blue-800",
  3: "bg-green-200 text-green-800",
};

const animalColors: { [key: number]: string } = {
  1: "bg-yellow-100 text-yellow-800",
  2: "bg-purple-200 text-purple-800",
  3: "bg-pink-200 text-pink-800",
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);

  const [barcode, setBarcode] = useState("");
  const [searchSku, setSearchSku] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState("");

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

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

    // Ordenamiento
    if (sortField && sortOrder) {
      filtered.sort((a, b) => {
        const aValue = a[sortField as keyof Product];
        const bValue = b[sortField as keyof Product];

        if (aValue == null || bValue == null) return 0;

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    }

    setFilteredProducts(filtered);
  }, [barcode, searchSku, selectedBrand, selectedAnimal, products, sortField, sortOrder]);

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

  const handleSortClick = (field: string) => {
    if (sortField !== field) {
      setSortField(field);
      setSortOrder("desc");
    } else if (sortOrder === "desc") {
      setSortOrder("asc");
    } else {
      setSortField(null);
      setSortOrder(null);
    }
  };

  const getBrandName = (brand_id: number) =>
    brands.find(b => b.id === brand_id)?.name || "-";

  const getAnimalName = (animal_id: number) =>
    animals.find(a => a.id === animal_id)?.name || "-";

  const getArrow = (field: string) => {
    if (sortField === field) {
      if (sortOrder === "asc") return " 🔼";
      if (sortOrder === "desc") return " 🔽";
    }
    return "";
  };

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
          className="p-3 border border-gray-300 rounded-lg shadow-sm"
          placeholder="Buscar por código de barras"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
        <input
          type="text"
          className="p-3 border border-gray-300 rounded-lg shadow-sm"
          placeholder="Buscar por SKU"
          value={searchSku}
          onChange={(e) => setSearchSku(e.target.value)}
        />
        <select
          title="Seleccionar Marca"
          className="p-3 border border-gray-300 rounded-lg shadow-sm"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">Filtrar por Marca</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>
        <select
          title="Seleccionar Animal"
          className="p-3 border border-gray-300 rounded-lg shadow-sm"
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
              <thead className="bg-dark_moss_green-500 text-white text-sm select-none">
                <tr>
                  <th className="p-4 cursor-pointer" onClick={() => handleSortClick("brand_id")}>
                    Marca{getArrow("brand_id")}
                  </th>
                  <th className="p-4 cursor-pointer" onClick={() => handleSortClick("animal_id")}>
                    Animal{getArrow("animal_id")}
                  </th>
                  {tableHeaders.map((header) => (
                    <th
                      key={header.key}
                      className="p-4 cursor-pointer"
                      onClick={() => handleSortClick(header.key)}
                    >
                      {header.label}{getArrow(header.key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 border-t">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${brandColors[product.brand_id] || "bg-gray-200 text-gray-700"}`}>
                        {getBrandName(product.brand_id)}
                      </span>
                    </td>
                    <td className="p-4 border-t">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${animalColors[product.animal_id] || "bg-gray-100 text-gray-700"}`}>
                        {getAnimalName(product.animal_id)}
                      </span>
                    </td>
                    {tableHeaders.map((header) => (
                      <td
                        key={header.key}
                        className={`p-4 border-t ${header.key === "retail_price" ? "font-bold" : ""}`}
                      >
                        {header.key === "retail_price" && typeof product[header.key as keyof Product] === "number"
                          ? formatPrice(product[header.key as keyof Product] as number)
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
