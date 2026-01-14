import { useEffect, useState } from "react";
import { api } from "../api";
import Input from "./Input";
import Select from "./Select";
import type { User, Country, Department, Municipality } from "../types";

interface Props {
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
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

export default function UserModal({ user, onClose, onSuccess }: Props) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    countryId: "",
    departmentId: "",
    municipalityId: ""
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const countriesRes = await api.get<Country[]>("/locations/countries");
        setCountries(countriesRes.data);

        if (user) {
          setForm({
            name: user.name,
            phone: user.phone,
            address: user.address,
            countryId: user.countryId.toString(),
            departmentId: user.departmentId.toString(),
            municipalityId: user.municipalityId.toString()
          });

          const [deptsRes, munRes] = await Promise.all([
            api.get<Department[]>(`/locations/departments/${user.countryId}`),
            api.get<Municipality[]>(`/locations/municipalities/${user.departmentId}`)
          ]);

          setDepartments(deptsRes.data);
          setMunicipalities(munRes.data);
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    };

    loadInitialData();
  }, [user]);

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

  const loadDepartments = (countryId: string) => {
    setForm({ ...form, countryId, departmentId: "", municipalityId: "" });
    setDepartments([]);
    setMunicipalities([]);

    if (countryId) {
      api.get<Department[]>(`/locations/departments/${countryId}`)
        .then((res) => setDepartments(res.data))
        .catch((err) => console.error("Error loading departments:", err));
    }
  };

  const loadMunicipalities = (departmentId: string) => {
    setForm({ ...form, departmentId, municipalityId: "" });
    setMunicipalities([]);

    if (departmentId) {
      api.get<Municipality[]>(`/locations/municipalities/${departmentId}`)
        .then((res) => setMunicipalities(res.data))
        .catch((err) => console.error("Error loading municipalities:", err));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setServerError("");

      const data = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        countryId: parseInt(form.countryId),
        departmentId: parseInt(form.departmentId),
        municipalityId: parseInt(form.municipalityId)
      };

      if (user) {
        await api.put(`/users/${user.id}`, data);
      } else {
        await api.post("/users", data);
      }

      onSuccess();
    } catch (err: any) {
      setServerError(
        err.response?.data?.error ||
        "Error al guardar el usuario. Por favor, intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-coink-teal">
              {user ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary"
              >
                {loading ? "Guardando..." : user ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
