import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-toastify/dist/ReactToastify.css';

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
    <div>
      <h2>Gestión de Usuarios</h2>
      {editingUser ? (
        <form onSubmit={handleEditSubmit}>
          <h3>Editar Usuario</h3>
          <input
            type="text"
            name="name"
            value={editForm.name}
            onChange={handleEditFormChange}
            placeholder="Nombre"
            required
          />
          <input
            type="email"
            name="email"
            value={editForm.email}
            onChange={handleEditFormChange}
            placeholder="Email"
            required
          />
          <select
            name="role"
            value={editForm.role}
            onChange={handleEditFormChange}
            required
          >
            <option value="">Selecciona un rol</option>
            <option value="admin">Admin</option>
            <option value="client">Cliente</option>
          </select>
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={cancelEdit}>Cancelar</button>
        </form>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Editar</button>
                  <button onClick={() => handleDeleteClick(user._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserManagement;