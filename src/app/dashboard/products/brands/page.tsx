"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Brand = { id: number; name: string };
type BrandLine = { id: number; name: string };

export default function Brands() {
  // Estados para la gestión de marcas
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [newBrandName, setNewBrandName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Estados para la edición de brand lines
  const [brandLines, setBrandLines] = useState<BrandLine[]>([]);
  // Controla si cada brand line está en modo edición; la clave es el id de la línea
  const [editingLines, setEditingLines] = useState<Record<number, boolean>>({});

  // Cargar atributos (lista de marcas)
  useEffect(() => {
    fetchAttributes();
  }, []);

  // Cada vez que se seleccione una marca se cargan sus brand lines.
  useEffect(() => {
    if (selectedBrandId) {
      fetchBrandLines(selectedBrandId);
    } else {
      setBrandLines([]);
    }
  }, [selectedBrandId]);

  async function fetchAttributes() {
    try {
      const res = await axios.get("/api/products/attributes");
      setBrands(res.data.brands);
    } catch (error) {
      console.error("Error fetching attributes:", error);
    }
  }

  // Supone que tienes un endpoint que devuelve las líneas de una marca determinada
  async function fetchBrandLines(brandId: string) {
    try {
      const res = await axios.get(`/api/brands/${brandId}`);
      // Se espera que el endpoint devuelva { lines: [...] }
      console.log(res.data);
      setBrandLines(res.data.brand.product_lines);
    } catch (error) {
      console.error("Error fetching brand lines:", error);
    }
  }

  const handleToggleAddBrand = () => {
    setIsAddingBrand(!isAddingBrand);
    if (isAddingBrand) {
      // Volver a modo "usar marca existente"
      setNewBrandName("");
    } else {
      // Cambiar a modo "crear nueva marca"
      setSelectedBrandId("");
    }
  };

  const handleSave = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsSaving(true);

    if (isAddingBrand) {
      if (!newBrandName.trim()) {
        alert("Por favor ingresa el nombre de la marca");
        setIsSaving(false);
        return;
      }
      try {
        const res = await axios.post(`{/api/brands/${selectedBrandId}/lines/}`, {
          name: newBrandName,
        });
        const created = res.data; // { id, name }
        console.log("Marca creada:", created);
        setBrands((prev) => [...prev, created]);
        setIsAddingBrand(false);
        setSelectedBrandId(String(created.id));
        setNewBrandName("");
        setSuccessMessage("Marca creada exitosamente");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Error creando marca:", error);
        setErrorMessage("Ocurrió un error al crear la marca. Inténtalo de nuevo.");
      } finally {
        setIsSaving(false);
      }
    } else {
      console.log("Se seleccionó la marca con ID:", selectedBrandId);
      setSuccessMessage("Marca seleccionada correctamente");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsSaving(false);
    }
  };

  // Para cada brand line, se gestiona el modo edición
  const toggleEditBrandLine = (lineId: number) => {
    setEditingLines((prev) => ({
      ...prev,
      [lineId]: !prev[lineId],
    }));
  };

  // Actualiza el valor (ya sea id o name) de la línea modificada
  const handleBrandLineChange = (lineId: number, field: "id" | "name", value: string) => {
    setBrandLines((prev) =>
      prev.map((line) => {
        if (line.id === lineId) {
          return {
            ...line,
            [field]: field === "id" ? Number(value) : value,
          };
        }
        return line;
      })
    );
  };

  // Guardar los cambios en las brand lines mediante un endpoint PUT
  const handleSaveBrandLines = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await axios.put(`/api/products/brands/${selectedBrandId}/lines`, {
        lines: brandLines,
      });
      console.log("Brand lines actualizados:", res.data);
      setSuccessMessage("Brand lines actualizados con éxito");
      setEditingLines({});
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating brand lines:", error);
      setErrorMessage("Ocurrió un error al actualizar las brand lines");
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-dark_moss_green-400 px-6">
      <div className="w-full max-w-screen-xl bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Seleccionar o Crear Marca</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
          {isAddingBrand ? (
            <input
              type="text"
              placeholder="Nombre de la nueva marca"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              className="w-full px-3 py-2 border border-dark_moss_green-200 rounded-md"
            />
          ) : (
            <select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="w-full px-3 py-2 border border-dark_moss_green-200 rounded-md"
            >
              <option value="">Seleccionar marca</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={handleToggleAddBrand}
            className="bg-dark_moss_green-500 hover:bg-dark_moss_green-600 text-white px-4 py-2 rounded"
          >
            {isAddingBrand ? "Usar marca existente" : "Crear nueva marca"}
          </button>
        </div>
        <button
          onClick={handleSave}
          className="bg-dark_moss_green-500 hover:bg-dark_moss_green-600 text-white px-4 py-2 rounded w-full"
          disabled={isSaving}
        >
          Guardar
        </button>
        {isSaving && <div className="text-center mt-4">Guardando...</div>}
        {errorMessage && <div className="text-red-500 text-center mt-4">{errorMessage}</div>}
        {successMessage && <div className="text-green-500 text-center mt-4">{successMessage}</div>}

        {/* Sección para editar las brand lines si se ha seleccionado una marca */}
        {selectedBrandId && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Editar Brand Lines</h2>
            {brandLines.map((line) => (
              <div key={line.id} className="flex items-center gap-4 mb-2">
                <input
                  type="text"
                  value={line.id}
                  disabled={!editingLines[line.id]}
                  onChange={(e) => handleBrandLineChange(line.id, "id", e.target.value)}
                  className="w-1/4 px-2 py-1 border border-dark_moss_green-200 rounded-md"
                />
                <input
                  type="text"
                  value={line.name}
                  disabled={!editingLines[line.id]}
                  onChange={(e) => handleBrandLineChange(line.id, "name", e.target.value)}
                  className="w-3/4 px-2 py-1 border border-dark_moss_green-200 rounded-md"
                />
                <button
                  onClick={() => toggleEditBrandLine(line.id)}
                  className="text-dark_moss_green-500 hover:text-dark_moss_green-600"
                >
                  {editingLines[line.id] ? "Listo" : "Editar"}
                </button>
              </div>
            ))}
            {brandLines.length > 0 && (
              <button
                onClick={handleSaveBrandLines}
                className="mt-4 bg-dark_moss_green-500 hover:bg-dark_moss_green-600 text-white px-4 py-2 rounded"
              >
                Guardar cambios
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
