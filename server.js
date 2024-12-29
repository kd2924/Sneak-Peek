const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config(); // Load environment variables

const app = express();

app.use(cors());

// Test route to ensure backend is running
app.get('/', (req, res) => {
    res.send('Sneaker Backend is Running');
});

// Sneaker search route
app.get('/api/sneakers', async (req, res) => {
    const { sku } = req.query;

    console.log(`Request received for SKU: ${sku}`); // Log the incoming request

    // Validate the SKU parameter
    if (!sku) {
        console.error('SKU parameter is missing');
        return res.status(400).json({ error: 'SKU is required' });
    }

    // Construct API URL
    const productUrl = `https://stockx.com/${sku}`;
    const externalApiUrl = `https://sneaker-database-stockx.p.rapidapi.com/searchByUrl?url=${encodeURIComponent(productUrl)}`;
    console.log(`Constructed External API URL: ${externalApiUrl}`); // Log the constructed URL

    try {
        // Fetch data from the RapidAPI endpoint
        const response = await fetch(externalApiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': process.env.RAPIDAPI_HOST,
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            },
        });

        // Handle response errors
        if (!response.ok) {
            console.error(`External API Error: ${response.statusText}`);
            throw new Error(`Failed to fetch from external API: ${response.statusText}`);
        }

        // Parse and return the data
        const data = await response.json();
        console.log('Fetched data successfully:', data); // Log fetched data
        res.json(data);
    } catch (error) {
        console.error(`Error fetching sneaker data: ${error.message}`);
        res.status(500).json({ error: `Failed to fetch sneaker data: ${error.message}` });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
