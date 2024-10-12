import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    category: '',
  });

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category' && value === 'new') {
      setIsAddingNewCategory(true);
    } else {
      setIsAddingNewCategory(false);
      setProduct({ ...product, [name]: value });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error al obtener categorías', error);
      toast.error('Error al obtener categorías');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      let categoryId = product.category;
      
      if (isAddingNewCategory) {
        const categoryResponse = await axios.post('/categories', { name: newCategory });
        categoryId = categoryResponse.data._id;
      }

      const productToAdd = { ...product, category: categoryId };
      await axios.post('/products', productToAdd);
      toast.success('Producto agregado correctamente');
      navigate('/admin-dashboard/inventory');
      
      setProduct({
        name: '',
        price: '',
        quantity: '',
        description: '',
        category: '',
      });
      setNewCategory('');
      setIsAddingNewCategory(false);
      fetchCategories();
    } catch (error) {
      console.error('Error al agregar producto', error);
      toast.error('Error al agregar producto');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-indigo-600">
        <h2 className="text-2xl font-bold text-white">Agregar Producto</h2>
      </div>
      <form onSubmit={handleAddProduct} className="p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Nombre del Producto"
            value={product.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Precio"
              value={product.price}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Cantidad</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Cantidad"
              value={product.quantity}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción del Producto</label>
          <textarea
            id="description"
            name="description"
            placeholder="Descripción del Producto"
            value={product.description}
            onChange={handleChange}
            required
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
          <select 
            id="category"
            name="category" 
            onChange={handleChange} 
            value={isAddingNewCategory ? 'new' : product.category}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
            <option value="new">Agregar nueva categoría</option>
          </select>
        </div>
        {isAddingNewCategory && (
          <div>
            <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700">Nueva Categoría</label>
            <input
              type="text"
              id="newCategory"
              placeholder="Nombre de la nueva categoría"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        )}
        <div>
          <button 
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Agregar Producto
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;