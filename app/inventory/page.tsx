'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  quantity: number
  rate: number
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Product 1', quantity: 10, rate: 500 },
    { id: '2', name: 'Product 2', quantity: 5, rate: 1000 },
  ])
  const [newProduct, setNewProduct] = useState('')
  const [newQuantity, setNewQuantity] = useState(0)
  const [newRate, setNewRate] = useState(0)

  const handleAddProduct = () => {
    if (newProduct && newQuantity > 0 && newRate > 0) {
      setProducts([
        ...products,
        {
          id: Date.now().toString(),
          name: newProduct,
          quantity: newQuantity,
          rate: newRate,
        },
      ])
      setNewProduct('')
      setNewQuantity(0)
      setNewRate(0)
    }
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Inventory</h1>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Add Product</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              placeholder="Product name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
              placeholder="Quantity"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              value={newRate}
              onChange={(e) => setNewRate(parseFloat(e.target.value) || 0)}
              placeholder="Rate"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddProduct}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Add Product
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-gray-800">{product.name}</p>
              <p className="text-gray-600 text-sm">Qty: {product.quantity} | Rate: ₹{product.rate}</p>
            </div>
          ))}
        </div>

        <Link
          href="/dashboard"
          className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 font-semibold"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
