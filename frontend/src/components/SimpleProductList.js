import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../axiosConfig';

const SimpleProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
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
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>
              <td>{product.description || 'Sin descripción'}</td>
              <td>{product.category?.name || 'Sin categoría'}</td>
              <td>{product.inStock ? 'Sí' : 'No'}</td>
              <td>{new Date(product.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleProductList;