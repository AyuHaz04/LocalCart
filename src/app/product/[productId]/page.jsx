import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import BuyButton from "@/components/products/BuyButton";
import Link from "next/link";

export default async function ProductPage({ params }) {
   const { productId } = await params; // ← await params here too

  await connectDB();

  const product = await Product.findById(productId).populate("shop");

  if (!product) {
    return <div className="p-10 text-center">Product not found.</div>;
  }

  // Convert to plain object for client components
  const productData = JSON.parse(JSON.stringify(product));

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-4">
          <img
            src={productData.images[0]}
            alt={productData.name}
            className="w-full h-80 object-cover rounded-xl shadow-sm"
          />
          {productData.images.length > 1 && (
            <div className="flex gap-2">
              {productData.images.slice(1).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${productData.name} ${i + 2}`}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full capitalize">
            {productData.category}
          </span>
          <h1 className="text-2xl font-bold text-gray-800 mt-3">
            {productData.name}
          </h1>
          <p className="text-gray-500 mt-2">{productData.description}</p>

          <div className="mt-6">
            <span className="text-3xl font-bold text-blue-600">
              ₹{productData.price}
            </span>
          </div>

          <p className="text-sm text-gray-400 mt-2">
            {productData.stock > 0
              ? `${productData.stock} in stock`
              : "Out of stock"}
          </p>

          {/* Shop info */}
          <Link
            href={`/shop/${productData.shop._id}`}
            className="flex items-center gap-3 mt-6 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            {productData.shop.logo && (
              <img
                src={productData.shop.logo}
                alt={productData.shop.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-sm font-medium text-gray-800">
                {productData.shop.name}
              </p>
              <p className="text-xs text-gray-400">Visit shop →</p>
            </div>
          </Link>

          {/* Buy Button */}
          <div className="mt-6">
            <BuyButton
              product={productData}
              inStock={productData.stock > 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}