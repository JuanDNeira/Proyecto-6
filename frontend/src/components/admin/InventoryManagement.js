import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { toast } from 'react-toastify';
import { PlusCircle, XCircle } from 'lucide-react';
import ProductList from '../ProductList';
import ProductForm from '../ProductForm';
import '../../tailwind.css';


function InventoryManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);


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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Inventario</h1>

          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <button
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="flex items-center">
                  {showForm ? (
                    <>
                      <XCircle className="mr-2 h-5 w-5" />
                      Cerrar Formulario
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Agregar Nuevo Producto
                    </>
                  )}
                </span>
              </button>

            </div>

            {showForm && (
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <ProductForm
                  onAddProduct={handleAddProduct}
                  editingProduct={editingProduct}
                  onUpdateProduct={handleUpdateProduct}
                  categories={categories}
                />
              </div>
            )}

            <div className="p-6">
              <ProductList
                products={products}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryManagement;