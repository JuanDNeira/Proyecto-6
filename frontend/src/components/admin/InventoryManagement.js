import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { toast } from 'react-toastify';
import ProductList from '../ProductList';
import ProductForm from '../ProductForm';

function InventoryManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
    setShowForm(false);
    toast.success('Producto agregado correctamente');
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
    setEditingProduct(null);
    setShowForm(false);
    toast.success('Producto actualizado correctamente');
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p._id !== productId));
    toast.success('Producto eliminado correctamente');
  };

  const filteredProducts = products
    .filter(product => filterCategory ? product.category._id === filterCategory : true)
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <h2>Gestión de Inventario</h2>
      <div>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cerrar Formulario' : 'Agregar Nuevo Producto'}
        </button>
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <input 
          type="text" 
          placeholder="Buscar productos..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {showForm && (
        <ProductForm 
          onAddProduct={handleAddProduct}
          editingProduct={editingProduct}
          onUpdateProduct={handleUpdateProduct}
          categories={categories}
        />
      )}
      <ProductList 
        products={filteredProducts}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
}

export default InventoryManagement;