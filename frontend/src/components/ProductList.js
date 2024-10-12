import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from '../axiosConfig';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editFormData, setEditFormData] = useState({});
  const [filterCategory, setFilterCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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
      const response = await axios.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error al obtener las categorías', error);
      toast.error('Error al obtener las categorías');
    }
  };

  const handleEditClick = (product) => {
    setEditFormData(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditFormData({});
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`/products/${editFormData._id}`, editFormData);
      toast.success('Producto actualizado correctamente');
      window.location.reload(); 
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
              toast.error('Error al eliminar el producto');
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

  const filteredProducts = filterCategory
    ? products.filter(product => product.category?._id === filterCategory)
    : products;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Gestión de Productos</h2>
      <div className="mb-4 flex justify-center">
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
      </div>
      <table className="min-w-full bg-white border border-gray-300 rounded shadow-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Nombre</th>
            <th className="px-4 py-2 border">Precio</th>
            <th className="px-4 py-2 border">Cantidad</th>
            <th className="px-4 py-2 border">Descripción</th>
            <th className="px-4 py-2 border">Categoría</th>
            <th className="px-4 py-2 border">En Stock</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border">{product.name}</td>
              <td className="px-4 py-2 border">${product.price.toFixed(2)}</td>
              <td className="px-4 py-2 border">{product.quantity}</td>
              <td className="px-4 py-2 border">{product.description || 'Sin descripción'}</td>
              <td className="px-4 py-2 border">{product.category?.name || 'Sin categoría'}</td>
              <td className="px-4 py-2 border">
                <span className={`relative inline-block px-3 py-1 font-semibold ${
                  product.inStock ? 'text-green-900' : 'text-red-900'
                } leading-tight`}>
                  <span aria-hidden className={`absolute inset-0 ${
                    product.inStock ? 'bg-green-200' : 'bg-red-200'
                  } opacity-50 rounded-full`}></span>
                  <span className="relative">{product.inStock ? 'Sí' : 'No'}</span>
                </span>
              </td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600 transition duration-300"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(product._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
            <h3 className="text-2xl font-bold mb-6">Editar Producto</h3>
            <form onSubmit={handleEditFormSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={editFormData.name || ''}
                    onChange={handleEditFormChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                    Precio
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    value={editFormData.price || ''}
                    onChange={handleEditFormChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    value={editFormData.quantity || ''}
                    onChange={handleEditFormChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                    Categoría
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={editFormData.category || ''}
                    onChange={handleEditFormChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Seleccione una categoría</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Descripción
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={editFormData.description || ''}
                  onChange={handleEditFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="inStock">
                  En Stock
                </label>
                <select
                  name="inStock"
                  id="inStock"
                  value={editFormData.inStock ? 'true' : 'false'}
                  onChange={handleEditFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;