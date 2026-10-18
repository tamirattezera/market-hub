import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { apiRequest } from "../services/api.js";
import ProductsPage from "./ProductsPage.jsx";

vi.mock("../services/api.js", () => ({
  apiRequest: vi.fn(),
}));

function renderProductsPage() {
  return render(
    <MemoryRouter>
      <ProductsPage />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe("ProductsPage", () => {
  it("shows a loading message while the request is pending", () => {
    apiRequest.mockReturnValue(new Promise(() => {}));

    renderProductsPage();

    expect(screen.getByRole("status")).toHaveTextContent(/loading products/i);
  });

  it("shows an error and retries when the request fails", async () => {
    apiRequest.mockRejectedValueOnce(new Error("API unavailable"));

    renderProductsPage();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /API unavailable/i,
    );

    apiRequest.mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: 1,
          name: "Wireless Mouse",
          description: "Ergonomic wireless mouse.",
          price: "29.99",
          stock_quantity: 25,
        },
      ],
    });

    fireEvent.click(screen.getByRole("button", { name: /try again/i }));

    expect(
      await screen.findByRole("heading", {
        name: "Wireless Mouse",
      }),
    ).toBeInTheDocument();
  });

  it("shows an empty state when the API returns no products", async () => {
    apiRequest.mockResolvedValueOnce({
      success: true,
      data: [],
    });

    renderProductsPage();

    expect(
      await screen.findByRole("heading", {
        name: /no products yet/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders products returned by the API", async () => {
    apiRequest.mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: 1,
          name: "Wireless Mouse",
          description: "Ergonomic wireless mouse.",
          price: "29.99",
          stock_quantity: 25,
        },
      ],
    });

    renderProductsPage();

    expect(
      await screen.findByRole("heading", {
        name: "Wireless Mouse",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.getByText("25 in stock")).toBeInTheDocument();
    expect(screen.getByText("1 product")).toBeInTheDocument();
  });
});
