
import { Link } from "react-router";
import { useCart } from "../context/useCart.js";

export default function CartPage() {
  const {
    items,
    itemCount,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const subtotal = items.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0,
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
          Shopping Cart
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      {items.length === 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            Your cart is empty
          </h2>

          <p className="mt-2 text-slate-600">
            Explore the marketplace and add products you like.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-lg bg-sky-800 px-5 py-3 text-sm font-bold text-white hover:bg-sky-900"
          >
            Continue shopping
          </Link>
        </section>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section
            aria-label="Cart items"
            className="space-y-4"
          >
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                      Unit price: ${Number(item.price).toFixed(2)}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Available stock: {item.stock_quantity}
                    </p>
                  </div>

                  <p className="font-bold text-slate-900">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="text-sm font-semibold text-slate-700">
                    Quantity
                  </span>

                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${item.name}`}
                    onClick={() => decreaseQuantity(item.id)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 font-bold hover:bg-slate-100"
                  >
                    −
                  </button>

                  <span
                    aria-label={`Quantity of ${item.name}`}
                    className="min-w-6 text-center font-semibold"
                  >
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    aria-label={`Increase quantity of ${item.name}`}
                    onClick={() => increaseQuantity(item.id)}
                    disabled={
                      item.quantity >= Number(item.stock_quantity)
                    }
                    className="rounded-md border border-slate-300 px-3 py-1.5 font-bold hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="ml-auto text-sm font-semibold text-red-700 hover:text-red-900"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Order summary
            </h2>

            <div className="mt-5 flex justify-between gap-4 text-sm text-slate-600">
              <span>Items ({itemCount})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="mt-4 flex justify-between gap-4 border-t border-slate-200 pt-4 text-lg font-extrabold text-slate-950">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Shipping, taxes, and checkout will be handled in a later step.
            </p>

            <Link
              to="/products"
              className="mt-6 block rounded-lg bg-sky-800 px-4 py-3 text-center text-sm font-bold text-white hover:bg-sky-900"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
