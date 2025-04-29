"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { generateSKU, SKUData } from "@/app/utils/utils";
import { MovementTypeEnum } from "@/types/movementType";

/* ---------- Tipos ---------- */
type Brand = { id: number; name: string };
type Line = { id: number; name: string; brand_id: number };
type Animal = { id: number; name: string };
type AnimalAge = { id: number; name: string };
type AnimalSize = { id: number; name: string };
type SubProductLine = { id: number; name: string; productLineId: number };

/* ---------- Opciones de movimiento ---------- */
const movementTypeOptions = [
  { id: MovementTypeEnum.PURCHASE_IN, name: "Ingreso compra" },
  { id: MovementTypeEnum.ADJUST_PLUS, name: "Ajuste +" },
  { id: MovementTypeEnum.ADJUST_MINUS, name: "Ajuste –" },
  { id: MovementTypeEnum.RETURN_IN, name: "Devolución" },
];

export default function NewProductPage() {
  const router = useRouter();

  /* ---------- catálogos ---------- */
  const [brands, setBrands] = useState<Brand[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [animalAges, setAnimalAges] = useState<AnimalAge[]>([]);
  const [animalSizes, setAnimalSizes] = useState<AnimalSize[]>([]);
  const [subProductLines, setSubProductLines] = useState<SubProductLine[]>([]);
  const [originalStock, setOriginalStock] = useState(0);
  const [existingId, setExistingId] = useState<number | null>(null);

  /* ---------- filtrados ---------- */
  const [filteredLines, setFilteredLines] = useState<Line[]>([]);
  const [filteredSubProductLines, setFilteredSubProductLines] = useState<SubProductLine[]>([]);

  /* ---------- flags ---------- */
  const [barcodeChecked, setBarcodeChecked] = useState(false);
  const [editWarning, setEditWarning] = useState("");
  const [isCheckingBarcode, setIsCheckingBarcode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------- productId ---------- */
  const { id: productId } = useParams<{ id?: string }>();
  const isEdit = !!productId;           // true = editando, false = creando

  /* ---------- form ---------- */
  const [formData, setFormData] = useState({
    barcode: "",
    weight: "",
    extra_weight: "",
    retail_price: "",
    wholesale_price: "",
    stock: "",
    movement_type_id: String(MovementTypeEnum.PURCHASE_IN),
    sku: "",
    description: "",
    brand_id: "",
    line_id: "",
    sub_product_line_id: "",
    animal_id: "",
    animal_age_id: "",
    animal_size_id: "",
  });

  /* ---------- Generadores ---------- */
  const sku: string = generateSKU(
    formData as SKUData,
    brands,
    lines,
    animals,
    animalAges,
    animalSizes
  );

  const generateDescription = useCallback(() => {
    const brand = brands.find((b) => b.id === +formData.brand_id);
    const line = lines.find((l) => l.id === +formData.line_id);
    const animal = animals.find((a) => a.id === +formData.animal_id);
    const age = animalAges.find((a) => a.id === +formData.animal_age_id);
    const size = animalSizes.find((s) => s.id === +formData.animal_size_id);
    const weight = formData.weight;

    if (!brand && !line && !weight) return "";

    return [brand?.name, line?.name, animal?.name, age?.name, size?.name, weight ? `x${weight}kg` : null]
      .filter(Boolean as any)
      .join(" ");
  }, [brands, lines, animals, animalAges, animalSizes, formData]);

  /* ---------- helpers ---------- */
  const createInitialStockMovement = async (
    productId: number,
    qty: number,
    movementTypeId: number,
  ) => {
    if (!qty) return;
    await axios.post("/api/stock-movements", {
      productId,
      movementType: movementTypeId,
      change: qty,
      referenceId: 0,
    });
  };

  /* ---------- cargar catálogos ---------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/products/attributes");
        setBrands(res.data.brands);
        setLines(res.data.lines);
        setAnimals(res.data.animals);
        setAnimalAges(res.data.animalAges);
        setAnimalSizes(res.data.animalSizes);
        setSubProductLines(res.data.subProductLines);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    })();
  }, []);

  /* ---------- filtrados dependientes ---------- */
  useEffect(() => {
    setFilteredLines(formData.brand_id ? lines.filter(l => l.brand_id === +formData.brand_id) : []);
  }, [formData.brand_id, lines]);

  useEffect(() => {
    setFilteredSubProductLines(
      formData.line_id ? subProductLines.filter(s => s.productLineId === +formData.line_id) : []
    );
  }, [formData.line_id, subProductLines]);

  /* ---------- recalcular SKU & descripción ---------- */
  useEffect(() => {
    const description = generateDescription();
    setFormData(prev =>
      prev.sku !== sku || prev.description !== description
        ? { ...prev, sku, description }
        : prev
    );
  }, [generateDescription, sku]);

  /* ---------- handlers ---------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "brand_id" ? { line_id: "", sub_product_line_id: "" } : {}),
    }));
  };

  const checkBarcode = async () => {
    if (!formData.barcode) return;

    setIsCheckingBarcode(true);
    setEditWarning("");
    setBarcodeChecked(false);

    try {
      /* 1. Preguntamos si existe el código */
      const { data: product } = await axios.get(
        `/api/products/check-barcode?barcode=${formData.barcode}`
      );

      if (product) {
        /* 2. Mostrar mensaje */
        setEditWarning("Cuidado: vas a editar un producto.");

        setExistingId(product.id);
        setOriginalStock(product.stock);

        setOriginalStock(product.stock);

        /* 3. Copiar datos al formulario (→ strings) */
        setFormData(prev => ({
          ...prev,
          ...product,
          weight: String(product.weight),
          extra_weight: String(product.extra_weight),
          retail_price: String(product.retail_price),
          wholesale_price: String(product.wholesale_price),
          stock: String(product.stock),
          brand_id: String(product.brand_id),
          line_id: String(product.product_line_id),
          sub_product_line_id: product.sub_product_line_id
            ? String(product.sub_product_line_id)
            : "",
          animal_id: String(product.animal_id),
          animal_age_id: String(product.animal_age_id),
          /* mantenemos el movement_type fijo */
          movement_type_id: String(MovementTypeEnum.PURCHASE_IN),
        }));

        /* 4. Desbloqueamos el resto del formulario */
        setBarcodeChecked(true);
      } else {
        setExistingId(null);
        setBarcodeChecked(true);
      }
    } catch {
      setEditWarning("Error al verificar el código de barras.");
    } finally {
      setIsCheckingBarcode(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const qty = parseInt(formData.stock) || 0;           // stock final deseado
      const movementTypeId = +formData.movement_type_id;              // drop-down
      const body = {
        ...formData,
        weight: parseFloat(formData.weight),
        extra_weight: parseFloat(formData.extra_weight) || 0,
        retail_price: parseFloat(formData.retail_price),
        wholesale_price: parseFloat(formData.wholesale_price),
        brand_id: +formData.brand_id,
        product_line_id: +formData.line_id,
        sub_product_line_id: formData.sub_product_line_id ? +formData.sub_product_line_id : undefined,
        animal_id: +formData.animal_id,
        animal_age_id: +formData.animal_age_id,
        animal_size_id: formData.animal_size_id ? +formData.animal_size_id : null,
      };

      /* ---------- CREATE ---------- */
      if (isEdit) {
        if (movementTypeId !== MovementTypeEnum.PURCHASE_IN) {
          alert("Para un producto nuevo el tipo de movimiento debe ser 'Ingreso compra'.");
          setIsSubmitting(false);
          return;
        }

        // 1· Crear con stock = 0
        const { data: product } = await axios.post("/api/products", {
          ...body,
          stock: 0,
        });

        // 2· Movimiento ingreso compra
        await createInitialStockMovement(
          product.id,
          qty,
          MovementTypeEnum.PURCHASE_IN
        );
      } else {
        // 1· Actualizar producto existente
        await axios.put(`/api/products/${body.sku}`, {
          ...body,
          stock: qty,
        });

        // 2· Ajuste de stock si cambió
        const delta = qty - originalStock;
        if (delta !== 0) {
          await createInitialStockMovement(
            Number(productId),
            Math.abs(delta),
            delta > 0 ? MovementTypeEnum.ADJUST_PLUS : MovementTypeEnum.ADJUST_MINUS
          );
        }
      }

      router.push("/dashboard/products");
    } catch (err) {
      console.error("Error guardando producto:", err);
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    if (!isEdit && +formData.movement_type_id !== MovementTypeEnum.PURCHASE_IN) {
      setFormData(prev => ({ ...prev, movement_type_id: String(MovementTypeEnum.PURCHASE_IN) }));
    }
  }, [isEdit, formData.movement_type_id]);

  /* ---------- render ---------- */
  return (
    <div className="w-full h-full flex justify-center items-center text-dark_moss_green-400 px-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-screen-xl bg-white rounded-xl p-8 shadow-lg"
      >
        {/* Cabecera */}
        <div className="sm:col-span-2 lg:col-span-3 mb-4 flex flex-col lg:flex-row gap-2">
          <h1 className="text-3xl font-bold">Nuevo Producto</h1>
          {formData.sku && <Badge value={`SKU: ${formData.sku}`} mono />}
          {formData.description && <Badge value={formData.description} />}
        </div>

        {/* Barcode */}
        <div className="sm:col-span-2 lg:col-span-3">
          <label htmlFor="barcode" className="block text-sm font-semibold mb-1">
            Código de Barras
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="barcode"
              name="barcode"
              placeholder="Código de Barras"
              value={formData.barcode}
              onChange={handleChange}
              disabled={isEdit}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  checkBarcode();
                }
              }}
              className="w-full px-3 py-2 border border-dark_moss_green-200 rounded-md"
            />
            <button
              type="button"
              onClick={checkBarcode}
              className="bg-dark_moss_green-500 hover:bg-dark_moss_green-600 text-white px-4 py-2 rounded"
            >
              Verificar
            </button>
          </div>
          {editWarning && <p className="text-yellow-500 text-sm mt-1">{editWarning}</p>}
        </div>

        {/* Selects */}
        <SelectField
          label="Marca"
          name="brand_id"
          value={formData.brand_id}
          onChange={handleChange}
          options={brands}
          disabled={!barcodeChecked || !isEdit}
        />
        <SelectField
          label="Línea"
          name="line_id"
          value={formData.line_id}
          onChange={handleChange}
          options={filteredLines}
          disabled={!formData.brand_id || !barcodeChecked || !isEdit}
        />
        <SelectField
          label="Sub Línea (opcional)"
          name="sub_product_line_id"
          value={formData.sub_product_line_id}
          onChange={handleChange}
          options={filteredSubProductLines}
          allowEmpty
          disabled={!formData.line_id || !barcodeChecked || !isEdit}
        />
        <SelectField
          label="Animal"
          name="animal_id"
          value={formData.animal_id}
          onChange={handleChange}
          options={animals}
          disabled={!barcodeChecked || !isEdit}
        />
        <SelectField
          label="Edad del Animal"
          name="animal_age_id"
          value={formData.animal_age_id}
          onChange={handleChange}
          options={animalAges}
          disabled={!barcodeChecked || !isEdit}
        />
        <SelectField
          label="Tamaño del Animal"
          name="animal_size_id"
          value={formData.animal_size_id}
          onChange={handleChange}
          options={animalSizes}
          allowEmpty
          disabled={!barcodeChecked || !isEdit}
        />

        {/* Numeric inputs */}
        {[
          { name: "weight", label: "Peso (kg)" },
          { name: "extra_weight", label: "Kg Gratis" },
          { name: "retail_price", label: "Precio Público" },
          { name: "wholesale_price", label: "Precio Mayorista" },
          { name: "stock", label: "Stock" },
        ].map(({ name, label }) => (
          <NumericInput
            key={name}
            name={name}
            label={label}
            value={(formData as any)[name]}
            onChange={handleChange}
            disabled={!barcodeChecked}
            required={name !== "extra_weight"}
          />
        ))}

        {/* Dropdown de tipo de movimiento */}
        <SelectField
          label="Tipo de movimiento"
          name="movement_type_id"
          value={formData.movement_type_id}
          onChange={handleChange}
          options={movementTypeOptions}
          disabled={!isEdit}          // solo editable cuando es edición
        />

        {/* Submit */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center mt-6">
          {isSubmitting ? (
            <LoadingSpinner size={28} color="#4b5d44" />
          ) : (
            <button
              type="submit"
              disabled={!barcodeChecked}
              className="bg-dark_moss_green-500 hover:bg-dark_moss_green-600 text-white px-6 py-3 rounded text-lg shadow transition-all disabled:opacity-50"
            >
              Crear Producto
            </button>
          )}
        </div>
      </form>

      {/* Overlay de loading barcode */}
      {isCheckingBarcode && (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-dark_moss_green-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

/* ---------- Sub-componentes ---------- */

function Badge({ value, mono = false }: { value: string; mono?: boolean }) {
  return (
    <span className={`text-lg px-3 py-1 rounded bg-gray-100 ${mono ? "font-mono" : ""}`}>
      {value}
    </span>
  );
}

function NumericInput({
  name,
  label,
  value,
  onChange,
  disabled,
  required,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold mb-1">
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        placeholder={label}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-dark_moss_green-200 rounded-md"
        disabled={disabled}
        required={required}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  allowEmpty = false,
  disabled = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { id: number; name: string }[];
  allowEmpty?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-3 py-2 border border-dark_moss_green-200 rounded-md disabled:bg-gray-100 disabled:text-gray-400"
        required={!allowEmpty}
      >
        {allowEmpty ? (
          <option value="">Sin especificar</option>
        ) : (
          <option value="">Seleccionar {label.toLowerCase()}</option>
        )}
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
