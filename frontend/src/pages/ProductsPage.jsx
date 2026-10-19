import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
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

function ProductCard({ product }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div
        aria-hidden="true"
        className="flex aspect-[4/3] items-center justify-center rounded-lg bg-slate-100 text-4xl text-slate-400"
      >
        ◈
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <h2 className="text-lg font-bold text-slate-950">{product.name}</h2>

        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
          {product.description || "No description available."}
        </p>

        <p className="mt-4 text-xl font-extrabold text-slate-950">
          {formatPrice(product.price)}
        </p>

        <p
          className={`mt-2 text-sm font-medium ${
            product.stock_quantity > 0 ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {product.stock_quantity > 0
            ? `${product.stock_quantity} in stock`
            : "Out of stock"}
        </p>
      </div>
    </article>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("q") ?? "").trim();

  const fetchProducts = useCallback(async (query) => {
    const queryString = query ? `?q=${encodeURIComponent(query)}` : "";

    const response = await apiRequest(`/api/products${queryString}`);

    if (
      !response ||
      response.success !== true ||
      !Array.isArray(response.data)
    ) {
      throw new Error("The server returned an invalid product catalog.");
    }

    return response.data;
  }, []);

  const loadProducts = useCallback(() => {
    setStatus("loading");
    setErrorMessage("");

    fetchProducts(searchQuery)
      .then((data) => {
        setProducts(data);
        setStatus("success");
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading products.",
        );
        setStatus("error");
      });
  }, [fetchProducts, searchQuery]);


  useEffect(() => {
    let active = true;

    fetchProducts(searchQuery)
      .then((data) => {
        if (active) {
          setProducts(data);
          setErrorMessage("");
          setStatus("success");
        }
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Something went wrong while loading products.",
          );
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, [fetchProducts, searchQuery]);



  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="border-b border-slate-200 pb-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-800">
          Discover
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          Explore products
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          Browse the products available in Market Hub and compare your options.
        </p>
      </header>

      <section
        aria-labelledby="catalog-heading"
        aria-busy={status === "loading"}
        className="py-10 sm:py-12"
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 id="catalog-heading" className="text-xl font-bold text-slate-950">
            Product catalog
          </h2>

          {status === "success" && (
            <p className="text-sm text-slate-600">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          )}
        </div>

        {status === "loading" && (
          <p role="status" className="py-12 text-center text-slate-600">
            Loading products…
          </p>
        )}

        {status === "error" && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 p-6"
          >
            <h3 className="font-bold text-rose-900">
              We couldn't load the catalog
            </h3>

            <p className="mt-2 text-sm leading-6 text-rose-800">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={loadProducts}
              className="mt-4 rounded-lg bg-rose-800 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-rose-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-800"
            >
              Try again
            </button>
          </div>
        )}

        {status === "success" && products.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
            <h3 className="text-lg font-bold text-slate-950">
              No products yet
            </h3>

            <p className="mt-2 text-slate-600">
              Products will appear here when they are added to the catalog.
            </p>
          </div>
        )}

        {status === "success" && products.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-slate-200 pt-6">
        <Link
          to="/"
          className="inline-flex rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-50"
        >
          Back to home
        </Link>
      </footer>
    </main>
  );
}
