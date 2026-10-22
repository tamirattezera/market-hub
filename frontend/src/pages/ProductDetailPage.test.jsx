import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { CartProvider } from "../context/CartContext.jsx";
import ProductDetailPage from "./ProductDetailPage.jsx";
import { apiRequest } from "../services/api.js";

vi.mock("../services/api.js", () => ({
  apiRequest: vi.fn(),
}));

const product = {
  id: 1,
  name: "Mechanical Keyboard",
  description: "A comfortable keyboard for everyday work.",
  price: "79.99",
  stock_quantity: 12,
  category_name: "Electronics",
};

function renderProductPage() {
  return render(
    <MemoryRouter initialEntries={["/products/1"]}>
      <CartProvider>
        <Routes>
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>,
  );
}

describe("ProductDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows a loading message while the product request is pending", () => {
    apiRequest.mockReturnValue(new Promise(() => {}));

    renderProductPage();

    expect(screen.getByRole("status")).toHaveTextContent("Loading product...");
  });

  it("renders product details when the API request succeeds", async () => {
    apiRequest.mockResolvedValue({
      success: true,
      data: product,
    });

    renderProductPage();

    expect(
      await screen.findByRole("heading", {
        name: "Mechanical Keyboard",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("A comfortable keyboard for everyday work."),
    ).toBeInTheDocument();
    expect(screen.getByText("$79.99")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("12 in stock")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add to Cart" })).toBeEnabled();

    expect(apiRequest).toHaveBeenCalledWith("/api/products/1");
  });

  it("adds the product to the cart and shows confirmation", async () => {
    apiRequest.mockResolvedValue({
      success: true,
      data: product,
    });

    renderProductPage();

    await screen.findByRole("heading", {
      name: "Mechanical Keyboard",
    });

    fireEvent.click(screen.getByRole("button", { name: "Add to Cart" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Mechanical Keyboard added to your cart.",
    );
  });

  it("shows an error when the product request fails", async () => {
    apiRequest.mockRejectedValue(new Error("Product not found"));

    renderProductPage();

    expect(
      await screen.findByRole("heading", {
        name: "Unable to load product",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Product not found")).toBeInTheDocument();
  });

  it("retries the request when the Retry button is clicked", async () => {
    apiRequest
      .mockRejectedValueOnce(new Error("Temporary failure"))
      .mockResolvedValueOnce({
        success: true,
        data: product,
      });

    renderProductPage();

    await screen.findByText("Temporary failure");

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(
      await screen.findByRole("heading", {
        name: "Mechanical Keyboard",
      }),
    ).toBeInTheDocument();

    expect(apiRequest).toHaveBeenCalledTimes(2);
  });
});
