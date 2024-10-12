import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { toast } from 'react-toastify';
import { useCart } from './CartContext';
import { Search, Filter, ShoppingCart } from 'lucide-react';

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

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
      toast.error('Error al cargar los productos');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error al obtener las categorías', error);
      toast.error('Error al cargar las categorías');
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success('Producto añadido al carrito');
  };

  const filteredProducts = products
    .filter(product => selectedCategory ? product.category._id === selectedCategory : true)
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Catálogo de Productos</h2>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="relative flex-grow mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none w-full pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-lg font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</p>
              <button 
                onClick={() => handleAddToCart(product)}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
              >
                <ShoppingCart className="mr-2" size={20} />
                Añadir al Carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCatalog;