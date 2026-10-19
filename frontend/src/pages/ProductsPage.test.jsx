import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { apiRequest } from "../services/api.js";
import ProductsPage from "./ProductsPage.jsx";

vi.mock("../services/api.js", () => ({
  apiRequest: vi.fn(),
}));

const categories = [
  { id: 1, name: "Electronics", slug: "electronics" },
  { id: 2, name: "Books", slug: "books" },
];

const mouse = {
  id: 1,
  name: "Wireless Mouse",
  description: "Ergonomic wireless mouse.",
  price: "29.99",
  stock_quantity: 25,
  category_name: "Electronics",
  category_slug: "electronics",
  created_at: "2026-10-18T10:00:00.000Z",
};

const keyboard = {
  id: 2,
  name: "Mechanical Keyboard",
  description: "A mechanical keyboard.",
  price: "79.99",
  stock_quantity: 10,
  category_name: "Electronics",
  category_slug: "electronics",
  created_at: "2026-10-19T10:00:00.000Z",
};

function mockApi({ products = [mouse], categoryResponse } = {}) {
  apiRequest.mockImplementation((path) => {
    if (path === "/api/categories") {
      return categoryResponse
        ? Promise.resolve(categoryResponse)
        : Promise.resolve({ success: true, data: categories });
    }

    if (path.startsWith("/api/products")) {
      return Promise.resolve({ success: true, data: products });
    }

    return Promise.reject(new Error(`Unexpected API path: ${path}`));
  });
}

function renderProductsPage(initialEntry = "/products") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ProductsPage />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe("ProductsPage", () => {
  it("shows a loading message while the product request is pending", () => {
    apiRequest.mockImplementation(() => new Promise(() => {}));

    renderProductsPage();

    expect(screen.getByRole("status")).toHaveTextContent(/loading products/i);
  });

  it("shows an error and retries when the product request fails", async () => {
    let productRequests = 0;

    apiRequest.mockImplementation((path) => {
      if (path === "/api/categories") {
        return Promise.resolve({ success: true, data: categories });
      }

      productRequests += 1;

      if (productRequests === 1) {
        return Promise.reject(new Error("API unavailable"));
      }

      return Promise.resolve({ success: true, data: [mouse] });
    });

    renderProductsPage();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /API unavailable/i,
    );

    fireEvent.click(screen.getByRole("button", { name: /try again/i }));

    expect(
      await screen.findByRole("heading", { name: "Wireless Mouse" }),
    ).toBeInTheDocument();
  });

  it("shows an empty state when the API returns no products", async () => {
    mockApi({ products: [] });
    renderProductsPage();

    expect(
      await screen.findByRole("heading", { name: /no products found/i }),
    ).toBeInTheDocument();
  });

  it("renders product details and its category", async () => {
    mockApi();
    renderProductsPage();

    expect(
      await screen.findByRole("heading", { name: "Wireless Mouse" }),
    ).toBeInTheDocument();

    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.getByText("25 in stock")).toBeInTheDocument();
    expect(screen.getAllByText("Electronics")).toHaveLength(2);
    expect(screen.getByText("1 product")).toBeInTheDocument();
  });

  it("sends the URL search query to the products API", async () => {
    mockApi();
    renderProductsPage("/products?q=wireless%20mouse");

    expect(
      await screen.findByRole("heading", { name: "Wireless Mouse" }),
    ).toBeInTheDocument();

    expect(apiRequest).toHaveBeenCalledWith(
      "/api/products?q=wireless+mouse",
    );
  });

  it("sends the selected category from the URL to the API", async () => {
    mockApi();
    renderProductsPage("/products?category=electronics");

    expect(
      await screen.findByRole("heading", { name: "Wireless Mouse" }),
    ).toBeInTheDocument();

    expect(apiRequest).toHaveBeenCalledWith(
      "/api/products?category=electronics",
    );

    expect(screen.getByLabelText("Category")).toHaveValue("electronics");
  });

  it("preserves search and category while sorting products by price", async () => {
    mockApi({ products: [mouse, keyboard] });
    renderProductsPage(
      "/products?q=key&category=electronics&sort=price-asc",
    );

    await screen.findByRole("heading", { name: "Wireless Mouse" });

    const getDisplayedPrices = () =>
      screen.getAllByText(/^\$\d+\.\d{2}$/).map((element) => element.textContent);

    await waitFor(() => {
      expect(getDisplayedPrices()).toEqual(["$29.99", "$79.99"]);
    });

    fireEvent.change(screen.getByLabelText("Sort by"), {
      target: { value: "price-desc" },
    });

    await waitFor(() => {
      expect(getDisplayedPrices()).toEqual(["$79.99", "$29.99"]);
    });

    expect(screen.getByLabelText("Sort by")).toHaveValue("price-desc");
    expect(screen.getByLabelText("Category")).toHaveValue("electronics");
    expect(apiRequest).toHaveBeenCalledWith(
      "/api/products?q=key&category=electronics",
    );
  });

  it("shows an empty state when a search has no matches", async () => {
    mockApi({ products: [] });
    renderProductsPage("/products?q=not-found");

    expect(
      await screen.findByRole("heading", { name: /no products found/i }),
    ).toBeInTheDocument();

    expect(apiRequest).toHaveBeenCalledWith("/api/products?q=not-found");
  });

  it("reports a category-loading error without hiding products", async () => {
    mockApi({
      categoryResponse: Promise.reject(new Error("Category API unavailable")),
    });
    renderProductsPage();

    expect(
      await screen.findByRole("heading", { name: "Wireless Mouse" }),
    ).toBeInTheDocument();

    expect(await screen.findByRole("status")).toHaveTextContent(
      /category api unavailable/i,
    );
  });
});
