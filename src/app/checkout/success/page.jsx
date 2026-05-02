import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-md text-center max-w-md">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-500 mb-6">
          Your payment was successful. The seller will prepare your order shortly.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/buyer"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            View My Orders
          </Link>
          <Link
            href="/explore"
            className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            Keep Exploring
          </Link>
        </div>
      </div>
    </div>
  );
}