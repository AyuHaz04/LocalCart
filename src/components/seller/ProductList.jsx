"use client";

import { useEffect, useState } from "react";

export default function ProductList({ shopId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [shopId]);

  const fetchProducts = async () => {
    const res = await fetch(`/api/products?shopId=${shopId}`);
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading products...</p>;

  if (products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-4xl mb-2">📦</p>
        <p>No products yet. Add your first one above!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Your Products ({products.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-sm p-4 flex gap-4"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-blue-600 font-semibold">
                  ₹{product.price}
                </span>
                <span className="text-xs text-gray-400">
                  Stock: {product.stock}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}