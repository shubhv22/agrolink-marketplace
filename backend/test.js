const assert = require('assert');
const calc = require('./utils/calculateOrder');

const r = calc([{ productId: 1, quantity: 2 }, { productId: 2, quantity: 1 }]);
assert.strictEqual(r.subtotal, 1300);
assert.strictEqual(r.gst, 234);
assert.strictEqual(r.total, 1534);
assert.throws(() => calc([{ productId: 3, quantity: 1 }]), /in stock/);
assert.throws(() => calc([{ productId: 1, quantity: 11 }]), /in stock/);
assert.throws(() => calc([]), /empty/);
console.log('All tests passed');
