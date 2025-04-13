'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type Brand = { id: number; name: string };
type Line = { id: number; name: string; brand_id: number };
type Animal = { id: number; name: string };
type AnimalAge = { id: number; name: string };
type AnimalSize = { id: number; name: string };

export default function NewProductPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [animalAges, setAnimalAges] = useState<AnimalAge[]>([]);
  const [animalSizes, setAnimalSizes] = useState<AnimalSize[]>([]);

  const [filteredLines, setFilteredLines] = useState<Line[]>([]);
  const [barcodeChecked, setBarcodeChecked] = useState(false);
  const [barcodeError, setBarcodeError] = useState('');

  const [isCheckingBarcode, setIsCheckingBarcode] = useState(false);

  const [formData, setFormData] = useState({
    barcode: '',
    weight: '',
    extra_weight: '',
    retail_price: '',
    wholesale_price: '',
    stock: '',
    sku: '',
    brand_id: '',
    line_id: '',
    animal_id: '',
    animal_age_id: '',
    animal_size_id: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.brand_id) {
      const filtered = lines.filter(line => line.brand_id === parseInt(formData.brand_id));
      setFilteredLines(filtered);
    } else {
      setFilteredLines([]);
    }
  }, [formData.brand_id, lines]);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/products/attributes');
      setBrands(res.data.brands);
      setLines(res.data.lines);
      setAnimals(res.data.animals);
      setAnimalAges(res.data.animalAges);
      setAnimalSizes(res.data.animalSizes);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const checkBarcode = async () => {
    if (!formData.barcode) return;
  
    setIsCheckingBarcode(true);
    setBarcodeError('');
    setBarcodeChecked(false);
  
    try {
      const res = await axios.get(`/api/products/check-barcode?barcode=${formData.barcode}`);
      if (res.data) {
        setBarcodeError("Este código de barras ya existe.");
      } else {
        setBarcodeChecked(true);
      }
    } catch (error) {
      console.error("Error verificando barcode:", error);
      setBarcodeError("Error al verificar el código de barras.");
    } finally {
      setIsCheckingBarcode(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'brand_id' ? { line_id: '' } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/products', {
        ...formData,
        weight: parseFloat(formData.weight),
        extra_weight: formData.extra_weight ? parseFloat(formData.extra_weight) : 0,
        retail_price: parseFloat(formData.retail_price),
        wholesale_price: parseFloat(formData.wholesale_price),
        stock: parseInt(formData.stock),
        brand_id: parseInt(formData.brand_id),
        product_line_id: parseInt(formData.line_id),
        animal_id: parseInt(formData.animal_id),
        animal_age_id: parseInt(formData.animal_age_id),
        animal_size_id: formData.animal_size_id ? parseInt(formData.animal_size_id) : null,
      });
      router.push('/dashboard/products');
    } catch (error) {
      console.error('Error al crear producto', error);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center text-dark_moss_green-400 px-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-screen-xl bg-white rounded-xl p-8 shadow-lg"
      >
        <h1 className="sm:col-span-2 lg:col-span-3 text-3xl font-bold mb-4">Nuevo Producto</h1>

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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Previene el submit del form
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
          {barcodeError && <p className="text-red-500 text-sm mt-1">{barcodeError}</p>}
        </div>

        <SelectField label="Marca" name="brand_id" value={formData.brand_id} onChange={handleChange} options={brands} disabled={!barcodeChecked} />
        <SelectField label="Línea" name="line_id" value={formData.line_id} onChange={handleChange} options={filteredLines} disabled={!formData.brand_id || !barcodeChecked} />
        <SelectField label="Animal" name="animal_id" value={formData.animal_id} onChange={handleChange} options={animals} disabled={!barcodeChecked} />
        <SelectField label="Edad del Animal" name="animal_age_id" value={formData.animal_age_id} onChange={handleChange} options={animalAges} disabled={!barcodeChecked} />
        <SelectField label="Tamaño del Animal" name="animal_size_id" value={formData.animal_size_id} onChange={handleChange} options={animalSizes} allowEmpty disabled={!barcodeChecked} />

        {[
          { name: 'weight', label: 'Peso (kg)' },
          { name: 'extra_weight', label: 'Kg Gratis' },
          { name: 'retail_price', label: 'Precio Público' },
          { name: 'wholesale_price', label: 'Precio Mayorista' },
          { name: 'stock', label: 'Stock' },
        ].map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-semibold mb-1">{field.label}</label>
            <input
              type="text"
              id={field.name}
              name={field.name}
              placeholder={field.label}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-dark_moss_green-200 rounded-md"
              disabled={!barcodeChecked}
              required={field.name !== 'extra_weight'}
            />
          </div>
        ))}

        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center mt-6">
          <button
            type="submit"
            disabled={!barcodeChecked}
            className="bg-dark_moss_green-500 hover:bg-dark_moss_green-600 text-white px-6 py-3 rounded text-lg shadow transition-all disabled:opacity-50"
          >
            Crear Producto
          </button>
        </div>
      </form>
      {isCheckingBarcode && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-dark_moss_green-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
       )}  
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { id: number; name: string }[];
  allowEmpty?: boolean;
  disabled?: boolean;
};

function SelectField({ label, name, value, onChange, options, allowEmpty = false, disabled = false }: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold mb-1">
        {label}
      </label>
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-3 py-2 border border-dark_moss_green-200 rounded-md disabled:bg-gray-100 disabled:text-gray-400"
        required={!allowEmpty}
      >
        {allowEmpty && <option value="">Sin especificar</option>}
        {!allowEmpty && <option value="">Seleccionar {label.toLowerCase()}</option>}
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>
    </div>
  );
}
