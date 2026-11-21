const express = require('express');
const cors = require('cors');
const products = require('./data/products.json');
const calculateOrder = require('./utils/calculateOrder');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/products', (req, res) => {
  const { category } = req.query;
  res.json(category && category !== 'All' ? products.filter((p) => p.category === category) : products);
});

app.post('/api/order/summary', (req, res) => {
  try {
    res.json(calculateOrder(req.body.items));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.listen(5000, () => console.log('API running on http://localhost:5000'));
