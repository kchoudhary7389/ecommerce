import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="sm:text-2xl text-lg font-semibold text-gray-900 mb-4 ">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-600 mb-8 sm:text-base text-sm">
          Thank you for your purchase. Your order has been received and is being
          processed.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate("/home")}
            className="w-full cursor-pointer bg-blue-600 text-white sm:py-2 sm:px-4 py-1 px-2 sm:text-base text-sm rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="w-full cursor-pointer bg-gray-200 text-gray-800 sm:py-2 sm:px-4 py-1 px-2 rounded-md hover:bg-gray-300 sm:text-base text-sm"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
