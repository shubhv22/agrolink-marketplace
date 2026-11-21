import { useEffect, useState } from 'react';

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
const CATEGORIES = ['All', 'Seeds', 'Fertilizer'];

export default function App() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // unfiltered, for stock lookups
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState({}); // { productId: quantity }
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/products?category=${category}`)
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => setError('Could not load products'));
  }, [category]);

  useEffect(() => {
    fetch('/api/products').then((r) => r.json()).then(setAllProducts).catch(() => {});
  }, []);

  useEffect(() => {
    const items = Object.entries(cart).map(([productId, quantity]) => ({ productId: Number(productId), quantity }));
    if (items.length === 0) return setSummary(null);
    fetch('/api/order/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
      .then((r) => r.json())
      .then((d) => (d.error ? setError(d.error) : (setError(''), setSummary(d))))
      .catch(() => setError('Could not calculate order'));
  }, [cart]);

  const stockOf = (id) => allProducts.find((p) => p.id === id)?.stock ?? 0;

  const changeQty = (id, delta) =>
    setCart((c) => {
      const next = (c[id] || 0) + delta;
      const copy = { ...c };
      if (next <= 0) delete copy[id];
      else if (next <= stockOf(id)) copy[id] = next;
      return copy;
    });

  return (
    <div className="container">
      <h1>🌾 Bharat Agrolink Marketplace</h1>
      {error && <p className="error">{error}</p>}

      <div className="filters">
        {CATEGORIES.map((c) => (
          <button key={c} className={c === category ? 'active' : ''} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="layout">
        <section className="grid">
          {products.map((p) => {
            const qty = cart[p.id] || 0;
            const out = p.stock === 0;
            return (
              <div className="card" key={p.id}>
                <img src={p.image} alt={p.name} />
                <h3>{p.name}</h3>
                <p className="muted">{p.category} • {p.seller}</p>
                <p className="price">{inr(p.price)}</p>
                <p className={out ? 'out' : 'muted'}>{out ? 'Out of Stock' : `Stock: ${p.stock}`}</p>
                {qty === 0 ? (
                  <button className="primary" disabled={out} onClick={() => changeQty(p.id, 1)}>
                    Add to Cart
                  </button>
                ) : (
                  <div className="qty">
                    <button onClick={() => changeQty(p.id, -1)}>−</button>
                    <span>{qty}</span>
                    <button disabled={qty >= p.stock} onClick={() => changeQty(p.id, 1)}>+</button>
                  </div>
                )}
                {qty >= p.stock && !out && <small className="error">Max stock reached</small>}
              </div>
            );
          })}
        </section>

        <aside className="summary">
          <h2>Order Summary</h2>
          {!summary && <p className="muted">Your cart is empty.</p>}
          {summary && (
            <>
              {Object.entries(summary.sellers).map(([seller, s]) => (
                <div key={seller} className="seller">
                  <h4>{seller}</h4>
                  {s.items.map((i) => (
                    <div className="row" key={i.id}>
                      <span>{i.name} × {i.quantity}</span>
                      <span>{inr(i.lineTotal)}</span>
                    </div>
                  ))}
                  <div className="row muted"><span>Seller subtotal</span><span>{inr(s.sellerSubtotal)}</span></div>
                </div>
              ))}
              <hr />
              <div className="row"><span>Subtotal</span><span>{inr(summary.subtotal)}</span></div>
              <div className="row"><span>GST 18%</span><span>{inr(summary.gst)}</span></div>
              <div className="row total"><span>Total</span><span>{inr(summary.total)}</span></div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
