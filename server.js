const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Example route
app.get('/api/sneakers', (req, res) => {
  const sku = req.query.sku;
  if (!sku) {
    return res.status(400).send({ error: 'SKU is required' });
  }

  // Example response
  res.send({ product: { name: 'Example Sneaker', price: 100 } });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
