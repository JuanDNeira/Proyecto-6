import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-toastify/dist/ReactToastify.css';
import { Edit2, Trash2 } from 'lucide-react';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error.response ? error.response.data : error.message);
        toast.error('Error al obtener la lista de usuarios');
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteClick = (id) => {
    confirmAlert({
      title: '⚠️ Confirmación',
      message: '¿Estás seguro de que quieres eliminar este usuario?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            const token = localStorage.getItem('token');
            try {
              await axios.delete(`/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setUsers(users.filter(user => user._id !== id));
              toast.success('Usuario eliminado correctamente');
            } catch (error) {
              console.error('Error al eliminar el usuario:', error);
              if (error.response) {
                toast.error(`Error al eliminar el usuario: ${error.response.data.message || error.message}`);
              } else {
                toast.error('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
              }
            }
          }
        },
        {
          label: 'No',
          onClick: () => toast.info('Eliminación cancelada')
        }
      ]
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role
    });
  };

  const handleEditFormChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/users/${editingUser._id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(users.map(user =>
        user._id === editingUser._id ? response.data : user
      ));

      setEditingUser(null);
      toast.success('Usuario actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      toast.error('Error al actualizar el usuario');
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Usuarios</h2>
      {editingUser ? (
        <form onSubmit={handleEditSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Editar Usuario</h3>
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleEditFormChange}
              placeholder="Nombre"
              required
            />
          </div>
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleEditFormChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-4">
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="role"
              value={editForm.role}
              onChange={handleEditFormChange}
              required
            >
              <option value="">Selecciona un rol</option>
              <option value="admin">Admin</option>
              <option value="client">Cliente</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Guardar Cambios
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={cancelEdit}
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md mr-2 transition duration-300 ease-in-out"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user._id)}
                      className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition duration-300 ease-in-out"
                    >
                      Eliminar
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserManagement;