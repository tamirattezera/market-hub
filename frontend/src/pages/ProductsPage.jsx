import { useCart } from "../context/useCart.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { apiRequest } from "../services/api.js";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

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
  const { addToCart } = useCart();
  const [addedMessage, setAddedMessage] = useState("");

  const inStock = Number(product.stock_quantity) > 0;

  function handleAddToCart() {
    if (!inStock) {
      return;
    }

    addToCart(product);
    setAddedMessage(`${product.name} added to your cart.`);
  }

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <Link
        to={`/products/${product.id}`}
        aria-label={`View ${product.name}`}
        className="flex aspect-[4/3] items-center justify-center rounded-lg bg-slate-100 text-4xl text-slate-400 focus-visible:outline-2 focus-visible:outline-sky-700"
      >
        ◈
      </Link>

      <div className="mt-5 flex flex-1 flex-col">
        {product.category_name && (
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-sky-800">
            {product.category_name}
          </p>
        )}

        <h2 className="text-lg font-bold text-slate-950">
          <Link
            to={`/products/${product.id}`}
            className="rounded-sm hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          >
            {product.name}
          </Link>
        </h2>

        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
          {product.description || "No description available."}
        </p>

        <p className="mt-4 text-xl font-extrabold text-slate-950">
          {formatPrice(product.price)}
        </p>

        <p
          className={`mt-2 text-sm font-medium ${
            inStock ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {inStock ? `${product.stock_quantity} in stock` : "Out of stock"}
        </p>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          className="mt-4 w-full rounded-lg bg-amber-400 px-4 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          {inStock ? "Add to Cart" : "Out of Stock"}
        </button>

        {addedMessage && (
          <p role="status" className="mt-2 text-sm text-green-700">
            {addedMessage}
          </p>
        )}
      </div>
    </article>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = (searchParams.get("q") ?? "").trim();
  const categorySlug = searchParams.get("category") ?? "";
  const requestedSort = searchParams.get("sort") ?? "newest";

  const sortOrder = SORT_OPTIONS.some(
    (option) => option.value === requestedSort,
  )
    ? requestedSort
    : "newest";

  const fetchProducts = useCallback(async (query, category) => {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (category) params.set("category", category);

    const queryString = params.toString();
    const path = `/api/products${queryString ? `?${queryString}` : ""}`;
    const response = await apiRequest(path);

    if (
      !response ||
      response.success !== true ||
      !Array.isArray(response.data)
    ) {
      throw new Error("The server returned an invalid product catalog.");
    }

    return response.data;
  }, []);

  useEffect(() => {
    let active = true;

    apiRequest("/api/categories")
      .then((response) => {
        if (
          !response ||
          response.success !== true ||
          !Array.isArray(response.data)
        ) {
          throw new Error("The server returned an invalid category list.");
        }

        if (active) {
          setCategories(response.data);
          setCategoryError("");
        }
      })
      .catch((error) => {
        if (active) {
          setCategoryError(
            error instanceof Error
              ? error.message
              : "Unable to load categories.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    fetchProducts(searchQuery, categorySlug)
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
  }, [fetchProducts, searchQuery, categorySlug, retryCount]);

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sortOrder === "price-asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOrder === "price-desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      result.sort((a, b) => {
        const dateDifference =
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime();

        return dateDifference || Number(b.id) - Number(a.id);
      });
    }

    return result;
  }, [products, sortOrder]);

  function updateFilter(key, value) {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    setSearchParams(nextParams);
  }

  function handleRetry() {
    setStatus("loading");
    setErrorMessage("");
    setRetryCount((count) => count + 1);
  }

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
              {sortedProducts.length}{" "}
              {sortedProducts.length === 1 ? "product" : "products"}
            </p>
          )}
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="category-filter"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Category
            </label>

            <select
              id="category-filter"
              value={categorySlug}
              onChange={(event) => updateFilter("category", event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>

            {categoryError && (
              <p className="mt-2 text-sm text-rose-700" role="status">
                Categories unavailable: {categoryError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="sort-products"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Sort by
            </label>

            <select
              id="sort-products"
              value={sortOrder}
              onChange={(event) => updateFilter("sort", event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setSearchParams(new URLSearchParams())}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              Clear filters
            </button>
          </div>
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
              onClick={handleRetry}
              className="mt-4 rounded-lg bg-rose-800 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-rose-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-800"
            >
              Try again
            </button>
          </div>
        )}

        {status === "success" && sortedProducts.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
            <h3 className="text-lg font-bold text-slate-950">
              No products found
            </h3>

            <p className="mt-2 text-slate-600">
              Try another search or category, or clear your filters.
            </p>
          </div>
        )}

        {status === "success" && sortedProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedProducts.map((product) => (
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
