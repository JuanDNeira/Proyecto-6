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
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      let categoryId = product.category;
      
      if (isAddingNewCategory) {
        // Create new category
        const categoryResponse = await axios.post('/categories', { name: newCategory });
        categoryId = categoryResponse.data._id;
      }

      // Add product with the category (existing or new)
      const productToAdd = { ...product, category: categoryId };
      const response = await axios.post('/products', productToAdd);
      toast.success('Producto agregado correctamente');
      navigate('//admin-dashboard/inventory');
      
      // Reset form and fetch updated categories
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
      alert('Error al agregar producto');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <form onSubmit={handleAddProduct}>
      <h2>Agregar Producto</h2>
      <input
        type="text"
        name="name"
        placeholder="Nombre del Producto"
        value={product.name}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Precio"
        value={product.price}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="quantity"
        placeholder="Cantidad"
        value={product.quantity}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Descripción del Producto"
        value={product.description}
        onChange={handleChange}
        required
      ></textarea>
      <select 
        name="category" 
        onChange={handleChange} 
        value={isAddingNewCategory ? 'new' : product.category}
        required
      >
        <option value="">Selecciona una categoría</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
        <option value="new">Agregar nueva categoría</option>
      </select>
      {isAddingNewCategory && (
        <input
          type="text"
          placeholder="Nombre de la nueva categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          required
        />
      )}
      <button type="submit">Agregar Producto</button>
    </form>
  );
};

export default ProductForm;