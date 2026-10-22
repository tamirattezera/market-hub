import { Route, Routes } from "react-router";
import SiteHeader from "./components/SiteHeader.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="*"
          element={
            <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-slate-900">
                Page not found
              </h1>
              <p className="mt-3 text-slate-600">
                The page you requested does not exist.
              </p>
            </main>
          }
        />
      </Routes>
    </div>
  );
}
