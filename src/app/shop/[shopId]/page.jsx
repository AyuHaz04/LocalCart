import { connectDB } from "@/lib/mongodb";
import Shop from "@/models/Shop";
import Product from "@/models/Product";
import Link from "next/link";

export default async function ShopPage({ params }) {
  const { shopId } = await params; // ← await params in Next.js 16

  await connectDB();

  const shop = await Shop.findById(shopId).populate("owner", "name");
  if (!shop) return <div className="p-10 text-center">Shop not found.</div>;

  const products = await Product.find({
    shop: shopId,
    isAvailable: true,
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Shop Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex items-center gap-6">
        {shop.logo ? (
          <img
            src={shop.logo}
            alt={shop.name}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl">
            🧵
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{shop.name}</h1>
          <p className="text-gray-500 mt-1">{shop.description}</p>
          <p className="text-sm text-gray-400 mt-2">
            📍 {shop.location.address} · 🚚 Delivers within {shop.deliveryRadius}km
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Products ({products.length})
      </h2>

      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-2">📦</p>
          <p>This shop has no products yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-blue-600 font-bold">
                    ₹{product.price}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                    {product.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}