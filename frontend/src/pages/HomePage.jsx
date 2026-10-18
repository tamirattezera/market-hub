import { Link } from "react-router";

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-800">
              Welcome to Market Hub
            </p>

            <h1 className="mt-5 max-w-2xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              A smarter way to discover what you need.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Explore a marketplace designed to make discovering products,
              comparing options, and shopping with confidence easier.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-lg bg-sky-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-sky-900"
              >
                Explore products
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-50"
              >
                Learn more
              </a>
            </div>
          </div>

          <div
            aria-label="Marketplace introduction"
            className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  The Market Hub vision
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                  One marketplace. A clearer experience.
                </h2>
              </div>

              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-2xl text-sky-900"
              >
                ◈
              </span>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Discover</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Find products through a searchable catalog.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Compare</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Review product information before making a decision.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Shop</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Work toward a reliable cart and checkout experience.
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs leading-5 text-slate-500">
              These are planned capabilities. Product listings and shopping
              transactions are not yet available.
            </p>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        aria-labelledby="marketplace-foundation-heading"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      >
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-800">
          Built step by step
        </p>

        <h2
          id="marketplace-foundation-heading"
          className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
        >
          A marketplace built on trust.
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          Market Hub is being developed from the ground up, with a real product
          catalog, secure backend, reliable data, and a shopping workflow that
          can be tested end to end.
        </p>
      </section>
    </main>
  );
}
