# Bharat Agrolink – Mini Agriculture Marketplace

Product listing + cart + seller-wise order summary with 18% GST.

**Stack:** React (Vite) · Node.js/Express · `products.json` as data source

## Run locally
```bash
# Terminal 1 – API (http://localhost:5000)
cd backend && npm install && npm start

# Terminal 2 – UI (http://localhost:5173)
cd frontend && npm install && npm run dev
```
Run calculation tests: `cd backend && npm test`

## API
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products?category=Seeds` | Product list, optional category filter |
| POST | `/api/order/summary` | Body: `{ "items": [{ "productId": 1, "quantity": 2 }] }` |

## Logic
- Cart is kept in React state as `{ productId: quantity }`; `+` is blocked at stock limit, `−` to 0 removes the item.
- Out-of-stock products have a disabled "Add to Cart" button.
- Calculation is server-side: it validates product, quantity and stock, groups items by seller, sums subtotal, GST = 18% of subtotal, total = subtotal + GST.
- Example: Wheat Seeds ×2 + Urea ×1 → ₹1,300 + ₹234 GST = **₹1,534**.
- Simplification: a real marketplace needs product-wise GST slabs and tax-inclusive/exclusive pricing.

## Screenshots
See `/screenshots`.
