import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="text-red-600 text-3xl font-bold">404</div>
      <h1 className="text-2xl font-bold text-gray-700 mt-4">Page Not Found</h1>
      <p className="text-gray-500 mb-6">
        Oops! The page you are looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
