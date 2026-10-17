# Market Hub

Market Hub is an Amazon-inspired, full-stack e-commerce marketplace built to develop and demonstrate professional software engineering skills.

The application aims to provide an end-to-end shopping experience, from discovering products and managing a shopping cart to placing orders and tracking purchases.

> **Project status:** Initial setup. The features described in this document are planned unless explicitly marked as implemented.

## Product Vision

Build a reliable, responsive, and accessible marketplace where customers can discover products, make informed purchasing decisions, and manage their shopping experience.

The project will also provide an opportunity to learn how a production-oriented e-commerce system works across the frontend, backend, database, security, testing, and deployment layers.

## Target Users

- **Customers:** Browse products, search categories, manage carts, and place orders.
- **Administrators:** Manage products, categories, inventory, and order operations.

## Planned Features

### 1. Product Discovery

- Responsive homepage and product navigation.
- Product listings with images, names, prices, and availability.
- Category browsing.
- Product search, filtering, and sorting.
- Individual product detail pages.
- Loading, error, empty, and success states.

### 2. Customer Accounts

- Customer registration and login.
- Secure password handling.
- Protected customer pages.
- Customer profile and address management.
- Authentication and authorization.

### 3. Shopping Cart

- Add and remove products.
- Update product quantities.
- Calculate item totals and cart totals.
- Persist cart data appropriately.
- Validate product availability and prices on the server.

### 4. Checkout and Orders

- Shipping address selection.
- Server-side order and price validation.
- Order creation and order-item records.
- Inventory updates.
- Order confirmation and purchase history.
- Order status tracking.

The initial checkout will use a simulated payment flow. Real payment integration will be considered separately, with appropriate security and provider requirements.

### 5. Administration

- Create, edit, and deactivate products.
- Manage product categories.
- Update inventory.
- View and manage orders.
- Restrict administrative actions to authorized users.

### 6. Quality and Reliability

- Responsive layouts for mobile, tablet, and desktop.
- Keyboard accessibility and meaningful image alternative text.
- Frontend, backend, and integration tests.
- Input validation and consistent API errors.
- Secure configuration and secret management.
- Production builds, deployment, and operational documentation.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React and JavaScript |
| Development and build tooling | Vite |
| Styling | Tailwind CSS |
| Frontend routing | React Router |
| Backend | Node.js and Express |
| API | REST |
| Database | MySQL |
| Version control | Git and GitHub |
| Testing | Frontend, backend, integration, and end-to-end tests |

Exact package versions, testing libraries, and deployment services will be confirmed during implementation.

**Language constraint:** This project uses JavaScript, not TypeScript.

## Planned Architecture

```text
Customer / Administrator
          |
          v
React Frontend
          |
          | HTTP / REST API
          v
Node.js + Express
          |
          +------ Authentication and authorization
          |
          +------ Product and category services
          |
          +------ Cart and order services
          |
          +------ Inventory and administration
          |
          v
        MySQL

External integrations, such as payment providers, will be
accessed through appropriate backend services.
```

### Architectural Principles

- Keep frontend, backend, database, and configuration responsibilities separate.
- Treat the backend as the authority for prices, permissions, inventory, and order creation.
- Validate untrusted input at the server boundary.
- Keep database credentials and private API keys out of browser code.
- Use database transactions where related operations must succeed or fail together.
- Design error handling and data validation explicitly.
- Avoid premature abstraction; introduce complexity when the requirements justify it.

## Planned API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Check API availability |
| GET | `/api/products` | Retrieve products, with optional search and filters |
| GET | `/api/products/:id` | Retrieve a specific product |
| GET | `/api/categories` | Retrieve categories |

Additional endpoints for accounts, carts, checkout, orders, inventory, and administration will be introduced as those features are implemented.

Request and response formats, validation rules, pagination, authentication requirements, and error formats will be documented before integration.

## Development Roadmap

1. **Repository foundation:** Git, documentation, project conventions, and environment checks.
2. **Frontend foundation:** React, Vite, Tailwind CSS, routing, and shared layout.
3. **Product catalog:** Homepage, product cards, search, categories, and product details.
4. **Backend foundation:** Express application, routes, middleware, and configuration.
5. **Database and catalog API:** MySQL schema, product data, category data, and endpoints.
6. **Frontend integration:** Connect the real API and handle loading, empty, and error states.
7. **Customer accounts:** Registration, login, authentication, authorization, and profiles.
8. **Shopping cart:** Cart operations, persistence, and server-side price validation.
9. **Checkout and orders:** Shipping details, order creation, inventory consistency, and order history.
10. **Administration:** Product, category, inventory, and order management.
11. **Testing and security:** Automated tests, accessibility, validation, and security review.
12. **Delivery:** Production builds, deployment, monitoring, and final documentation.

The sequence may be adjusted when implementation reveals technical dependencies or risks.

## Engineering Workflow

For each meaningful feature:

1. Understand the problem and acceptance criteria.
2. Inspect the existing code and dependencies.
3. Plan the smallest useful implementation.
4. Implement one reviewable change.
5. Run relevant checks and tests.
6. Inspect failures and debug their root causes.
7. Review the diff and document important decisions.
8. Commit only after verification and explicit approval.

## Quality Standards

- Never commit real secrets or private environment files.
- Do not hide API failures behind fake product data.
- Use semantic HTML and keyboard-accessible interactions.
- Provide meaningful image alternative text.
- Validate inputs and enforce permissions on the server.
- Never trust client-provided prices or inventory values.
- Test important success paths and failure cases.
- Use small, meaningful Git commits.
- Keep documentation aligned with the actual implementation.

## Current Project Status

The repository foundation and initial documentation are being established. Application features have not yet been implemented.

## License

No license has been selected yet. All rights reserved by default until a license is explicitly added.