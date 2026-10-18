import { Link, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";

export default function App() {
  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
        >
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-gray-900"
          >
            Market Hub
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              Products
            </Link>
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </>
  );
}
