const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static frontend files

// Root route for testing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API route for sneaker search
app.get('/api/sneakers', async (req, res) => {
    const { sku } = req.query;

    const productUrl = `https://stockx.com/${sku}`;
    const externalApiUrl = `https://sneaker-database-stockx.p.rapidapi.com/searchByUrl?url=${encodeURIComponent(productUrl)}`;

    try {
        const response = await fetch(externalApiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': process.env.RAPIDAPI_HOST,
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch from external API: ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        res.status(500).json({ error: `Failed to fetch sneaker data: ${error.message}` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
