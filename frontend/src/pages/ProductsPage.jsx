import { Link } from "react-router";

export default function ProductsPage() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="border-b border-slate-200 pb-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-800">
          Discover
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          Explore products
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          Find what you need, compare your options, and make informed shopping
          decisions. The product catalog is the next stage of development.
        </p>
      </div>

      <section
        aria-labelledby="catalog-empty-heading"
        className="flex flex-col items-center justify-center py-16 text-center sm:py-24"
      >
        <div
          aria-hidden="true"
          className="flex size-16 items-center justify-center rounded-2xl bg-sky-100 text-3xl text-sky-900"
        >
          ◈
        </div>

        <h2
          id="catalog-empty-heading"
          className="mt-6 text-xl font-bold text-slate-950 sm:text-2xl"
        >
          Your next discovery starts here
        </h2>

        <p className="mt-3 max-w-lg leading-7 text-slate-600">
          We're preparing the real product catalog. Product listings will appear
          here when the catalog API is connected.
        </p>

        <Link
          to="/"
          className="mt-7 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-50"
        >
          Back to home
        </Link>
      </section>
    </main>
  );
}
