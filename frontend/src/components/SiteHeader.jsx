import { Link, NavLink, useNavigate } from "react-router";

const navigationLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
    isActive
      ? "bg-sky-100 text-sky-900"
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
  }`;

export default function SiteHeader() {
  const navigate = useNavigate();

  function handleSearchSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = formData.get("q").toString().trim();

    if (!query) {
      navigate("/products");
      return;
    }

    navigate(`/products?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            aria-label="Market Hub home"
            className="shrink-0 text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl"
          >
            Market <span className="text-sky-700">Hub</span>
          </Link>

          <div
            aria-label="Shopping cart"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500"
          >
            Cart
            <span className="ml-2 text-xs font-normal">Coming soon</span>
          </div>
        </div>

        <form
          role="search"
          aria-label="Product catalog search"
          onSubmit={handleSearchSubmit}
          className="flex w-full"
        >
          <label htmlFor="catalog-search" className="sr-only">
            Search products
          </label>

          <input
            id="catalog-search"
            name="q"
            type="search"
            placeholder="Search the marketplace"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-l-lg border border-r-0 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400"
          />

          <button
            type="submit"
            className="rounded-r-lg bg-sky-800 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-sky-900"
          >
            Search
          </button>
        </form>

        <nav aria-label="Main navigation" className="flex items-center gap-2">
          <NavLink to="/" end className={navigationLinkClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={navigationLinkClass}>
            Products
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
