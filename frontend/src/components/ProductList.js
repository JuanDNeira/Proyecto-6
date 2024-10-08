import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from '../axiosConfig';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchCategories(); // Cargar las categorías para el select
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error al obtener los productos', error);
      toast.error('Error al obtener los productos');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories'); // Asegúrate de tener esta ruta en el backend
      setCategories(response.data);
    } catch (error) {
      console.error('Error al obtener las categorías', error);
      toast.error('Error al obtener las categorías');
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setEditFormData(product);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`/products/${editingId}`, editFormData);
      const updatedProducts = products.map((product) =>
        product._id === editingId ? editFormData : product
      );
      setProducts(updatedProducts);
      setEditingId(null);
      toast.success('Producto actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el producto', error);
      toast.error('Error al actualizar el producto');
    }
  };

  
  const handleDeleteClick = async (productId) => {
    confirmAlert({
      title: '⚠️ Confirmación',
      message: '¿Estás seguro de que quieres eliminar este producto?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await axios.delete(`/products/${productId}`);
              setProducts(products.filter((product) => product._id !== productId));
              toast.success('Producto eliminado correctamente');
            } catch (error) {
              console.error('Error al eliminar el producto', error);
              if (error.response) {
                toast.error(`Error al eliminar el producto: ${error.response.data.message || error.message}`);
              } else if (error.request) {
                toast.error('Error de conexión. Por favor, inténtalo de nuevo más tarde.');
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
  

  return (
    <div>
      <h2>Lista de Productos</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>En Stock</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              {editingId === product._id ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name || ''}
                      onChange={handleEditFormChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price"
                      value={editFormData.price || ''}
                      onChange={handleEditFormChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="quantity"
                      value={editFormData.quantity || ''}
                      onChange={handleEditFormChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="description"
                      value={editFormData.description || ''}
                      onChange={handleEditFormChange}
                    />
                  </td>
                  <td>
                    <select
                      name="category"
                      value={editFormData.category || ''}
                      onChange={handleEditFormChange}
                    >
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      name="inStock"
                      value={editFormData.inStock ? 'true' : 'false'}
                      onChange={handleEditFormChange}
                    >
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  </td>
                  <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={handleEditFormSubmit}>Guardar</button>
                    <button onClick={handleCancelEdit}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>{product.description || 'Sin descripción'}</td>
                  <td>{product.category?.name || 'Sin categoría'}</td>
                  <td>{product.inStock ? 'Sí' : 'No'}</td>
                  <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleEditClick(product)}>Editar</button>
                    <button onClick={() => handleDeleteClick(product._id)}>Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
