import { useEffect, useState } from "react";
import { api } from "./api";
import Input from "./components/Input";
import Select from "./components/Select";
import type { AxiosResponse, AxiosError } from 'axios';

interface Country {
  id: number;
  name: string;
  isoCode: string;
}

interface Department {
  id: number;
  name: string;
}

interface Municipality {
  id: number;
  name: string;
}

interface FormData {
  name: string;
  phone: string;
  address: string;
  countryId: string;
  departmentId: string;
  municipalityId: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
  countryId?: string;
  departmentId?: string;
  municipalityId?: string;
}

export default function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    countryId: "",
    departmentId: "",
    municipalityId: ""
  });

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }
    
    if (!form.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    } else if (!/^\d{7,15}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Ingrese un teléfono válido (7-15 dígitos)";
    }
    
    if (!form.address.trim()) {
      newErrors.address = "La dirección es obligatoria";
    } else if (form.address.trim().length < 5) {
      newErrors.address = "La dirección debe tener al menos 5 caracteres";
    }
    
    if (!form.countryId) newErrors.countryId = "Seleccione un país";
    if (!form.departmentId) newErrors.departmentId = "Seleccione un departamento";
    if (!form.municipalityId) newErrors.municipalityId = "Seleccione un municipio";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    api.get<Country[]>("/locations/countries")
      .then((res: AxiosResponse<Country[]>) => setCountries(res.data))
      .catch((err: AxiosError) => console.error("Error loading countries:", err));
  }, []);

  const loadDepartments = (countryId: string) => {
    setForm({ ...form, countryId, departmentId: "", municipalityId: "" });
    setDepartments([]);
    setMunicipalities([]);
    
    if (countryId) {
      api.get<Department[]>(`/locations/departments/${countryId}`)
        .then((res: AxiosResponse<Department[]>) => setDepartments(res.data))
        .catch((err: AxiosError) => console.error("Error loading departments:", err));
    }
  };

  const loadMunicipalities = (departmentId: string) => {
    setForm({ ...form, departmentId, municipalityId: "" });
    setMunicipalities([]);
    
    if (departmentId) {
      api.get<Municipality[]>(`/locations/municipalities/${departmentId}`)
        .then((res: AxiosResponse<Municipality[]>) => setMunicipalities(res.data))
        .catch((err: AxiosError) => console.error("Error loading municipalities:", err));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setLoading(true);
      setServerError("");
      setSuccess(false);
      
      await api.post("/users", {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        countryId: parseInt(form.countryId),
        departmentId: parseInt(form.departmentId),
        municipalityId: parseInt(form.municipalityId)
      });
      
      setSuccess(true);
      setForm({
        name: "",
        phone: "",
        address: "",
        countryId: "",
        departmentId: "",
        municipalityId: ""
      });
      setDepartments([]);
      setMunicipalities([]);
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>;
      setServerError(
        error.response?.data?.error || 
        "No se pudo registrar el usuario. Por favor, verifique los datos e intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con gradiente de Coink */}
      <header 
        className="w-full py-4 px-4 shadow-md"
        style={{
          backgroundImage: 'linear-gradient(90deg, #003336 0%, #004B40 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Coink
          </h1>
          <p className="text-sm text-gray-200 mt-1">
            Tu aliado financiero
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 py-6 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-coink-teal mb-2">
                Registro de Usuario
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Complete el formulario para crear su cuenta
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">¡Usuario registrado exitosamente!</span>
              </div>
            )}

            {/* Error Message */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6 flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{serverError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2">
              <Input
                label="Nombre completo"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={errors.name}
                placeholder="Ingrese su nombre completo"
              />

              <Input
                label="Teléfono"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                error={errors.phone}
                type="tel"
                placeholder="Ej: 3001234567"
              />

              <Input
                label="Dirección"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                error={errors.address}
                placeholder="Ingrese su dirección completa"
              />

              <Select
                label="País"
                value={form.countryId}
                onChange={(e) => loadDepartments(e.target.value)}
                options={countries}
                error={errors.countryId}
                placeholder="Seleccione su país"
              />

              <Select
                label="Departamento"
                value={form.departmentId}
                onChange={(e) => loadMunicipalities(e.target.value)}
                options={departments}
                error={errors.departmentId}
                placeholder="Seleccione su departamento"
              />

              <Select
                label="Municipio"
                value={form.municipalityId}
                onChange={(e) => setForm({ ...form, municipalityId: e.target.value })}
                options={municipalities}
                error={errors.municipalityId}
                placeholder="Seleccione su municipio"
              />

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registrando...
                    </span>
                  ) : (
                    'Registrar Usuario'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-600">
            <p>Coink - Entidad vigilada por la Superintendencia Financiera de Colombia</p>
          </div>
        </div>
      </main>
    </div>
  );
}
