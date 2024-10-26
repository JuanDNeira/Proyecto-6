import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { toast } from 'react-toastify';
import { PlusCircle, XCircle, FileDown } from 'lucide-react';
import ProductList from '../ProductList';
import ProductForm from '../ProductForm';
import ExcelJS from 'exceljs';
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

  const exportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Inventario');
      
      const headerStyle = {
        font: { bold: true, size: 12, color: { argb: 'FFFFFF' } },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4F46E5' } 
        },
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      };

      const cellStyle = {
        alignment: { horizontal: 'left', vertical: 'middle' },
        border: {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      };
  
      worksheet.columns = [
        { header: 'ID', key: '_id', width: 30 }, 
        { header: 'Nombre', key: 'name', width: 30 },
        { header: 'Descripción', key: 'description', width: 40 },
        { header: 'Categoría', key: 'category', width: 25 },
        { header: 'Precio', key: 'price', width: 15 },
        { header: 'Fecha de Creación', key: 'createdAt', width: 20 },
        { header: 'Última Actualización', key: 'updatedAt', width: 20 },
      ];

      worksheet.getRow(1).eachCell((cell) => {
        cell.style = headerStyle;
      });
      
      worksheet.getRow(1).height = 30;
  
      products.forEach((product) => {
        const row = worksheet.addRow({
          _id: product._id,
          name: product.name,
          description: product.description,
          category: product.category?.name || 'Sin categoría', 
          price: product.price,
          createdAt: new Date(product.createdAt).toLocaleDateString(),
          updatedAt: new Date(product.updatedAt).toLocaleDateString(),
        });

        row.eachCell((cell) => {
          cell.style = cellStyle;
        });

        const priceCell = row.getCell('price');
        priceCell.numFmt = '"$"#,##0.00';
      });
  
      worksheet.columns.forEach(column => {
        column.width = Math.max(column.width, 12);
      });
  
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fecha = new Date().toLocaleDateString().replace(/\//g, '-');
      link.download = `inventario-${fecha}.xlsx`;
      link.click();
      
      window.URL.revokeObjectURL(url);
      toast.success('Inventario exportado correctamente');
    } catch (error) {
      console.error('Error al exportar a Excel', error);
      toast.error('Error al exportar el inventario');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Inventario</h1>

          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
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

              <button
                onClick={exportToExcel}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FileDown className="mr-2 h-5 w-5" />
                Exportar a Excel
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