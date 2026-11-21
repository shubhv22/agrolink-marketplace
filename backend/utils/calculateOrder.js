const products = require('../data/products.json');
const GST_RATE = 0.18;

function calculateOrder(cartItems) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) throw new Error('Cart is empty');

  const sellers = {};
  let subtotal = 0;

  for (const { productId, quantity } of cartItems) {
    const p = products.find((x) => x.id === Number(productId));
    if (!p) throw new Error(`Product ${productId} not found`);
    if (!Number.isInteger(quantity) || quantity < 1) throw new Error(`${p.name}: invalid quantity`);
    if (quantity > p.stock) throw new Error(`${p.name}: only ${p.stock} in stock`);

    const lineTotal = p.price * quantity;
    subtotal += lineTotal;
    sellers[p.seller] ||= { items: [], sellerSubtotal: 0 };
    sellers[p.seller].items.push({ id: p.id, name: p.name, price: p.price, quantity, lineTotal });
    sellers[p.seller].sellerSubtotal += lineTotal;
  }

  const gst = Math.round(subtotal * GST_RATE * 100) / 100;
  return { sellers, subtotal, gst, total: subtotal + gst };
}

module.exports = calculateOrder;
