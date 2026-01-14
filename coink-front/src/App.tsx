import { useEffect, useState } from "react";
import { api } from "./api";
import UserTable from "./components/UserTable";
import UserModal from "./components/UserModal";
import type { User } from "./types";
import { useDebounce } from "./hooks/useDebounce";

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const debouncedSearch = useDebounce(search, 500);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users", {
        params: { search, page, pageSize }
      });
      setUsers(res.data.users);
      setTotalCount(res.data.totalCount);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, debouncedSearch]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este usuario?")) return;

    try {
      await api.delete(`/users/${id}`);
      loadUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error al eliminar el usuario");
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleModalSuccess = () => {
    loadUsers();
    handleModalClose();
  };

  const handleNewUser = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      <header
        className="w-full py-4 px-4 shadow-md"
        style={{
          backgroundImage: 'linear-gradient(90deg, #003336 0%, #004B40 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Coink</h1>
          <p className="text-sm text-gray-200 mt-1">Gestión de Usuarios</p>
        </div>
      </header>

      <main className="w-full px-4 py-6 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-[5fr_3fr_2fr] gap-4 mb-6 items-center">
              <h2 className="text-2xl font-bold text-coink-teal col-span-2 lg:col-span-1">
                Usuarios Registrados
              </h2>

              <div className="col-span-1">
                <input
                  type="text"
                  placeholder="Buscar por nombre o teléfono..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coink-teal focus:border-transparent"
                />
              </div>

              <div className="col-span-1">
                <button onClick={handleNewUser} className="btn-primary w-full">
                  + Nuevo Usuario
                </button>
              </div>
            </div>

            <UserTable
              users={users}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-600">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {modalOpen && (
        <UserModal
          user={selectedUser}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
