import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useCart } from "../context/useCart.js";
import { apiRequest } from "../services/api.js";

function formatPrice(price) {
  const amount = Number(price);

  if (!Number.isFinite(amount) || amount < 0) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError("");
    setProduct(null);
    setCartMessage("");

    try {
      const response = await apiRequest(`/api/products/${id}`);

      if (!response.success || !response.data) {
        throw new Error("Invalid product response from the server.");
      }

      setProduct(response.data);
    } catch (err) {
      setError(err.message || "Unable to load this product.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      setLoading(true);
      setError("");
      setProduct(null);
      setCartMessage("");

      try {
        const response = await apiRequest(`/api/products/${id}`);

        if (!response.success || !response.data) {
          throw new Error("Invalid product response from the server.");
        }

        if (!ignore) {
          setProduct(response.data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Unable to load this product.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [id]);

  function handleAddToCart() {
    if (!product || Number(product.stock_quantity) < 1) {
      return;
    }

    addToCart(product);
    setCartMessage(`${product.name} added to your cart.`);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/products"
        className="text-sm font-semibold text-sky-800 hover:underline"
      >
        &larr; Back to products
      </Link>

      {loading && (
        <p role="status" className="mt-8 text-slate-600">
          Loading product...
        </p>
      )}

      {!loading && error && (
        <section className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-bold text-red-900">
            Unable to load product
          </h1>
          <p className="mt-2 text-red-800">{error}</p>
          <button
            type="button"
            onClick={fetchProduct}
            className="mt-4 rounded-lg bg-red-800 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            Try again
          </button>
        </section>
      )}

      {!loading && !error && product && (
        <article className="mt-8 grid gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
          <div className="flex min-h-64 items-center justify-center rounded-xl bg-slate-100">
            <span aria-hidden="true" className="text-7xl text-slate-400">
              ◇
            </span>
          </div>

          <div>
            {product.category_name && (
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-800">
                {product.category_name}
              </p>
            )}

            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              {product.name}
            </h1>

            <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
              {product.description || "No description is available."}
            </p>

            <p className="mt-6 text-2xl font-bold text-slate-950">
              {formatPrice(product.price)}
            </p>

            <p className="mt-3 text-sm text-slate-600">
              {Number(product.stock_quantity) > 0
                ? `${product.stock_quantity} in stock`
                : "Currently out of stock"}
            </p>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={Number(product.stock_quantity) < 1}
              className="mt-6 w-full rounded-lg bg-amber-400 px-5 py-3 font-bold text-slate-950 transition-colors hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 sm:w-auto"
            >
              {Number(product.stock_quantity) > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </button>

            {cartMessage && (
              <p
                role="status"
                className="mt-3 text-sm font-medium text-green-700"
              >
                {cartMessage}
              </p>
            )}

            <p className="mt-6 text-sm text-slate-500">
              Product ID: {product.id}
            </p>
          </div>
        </article>
      )}
    </main>
  );
}
