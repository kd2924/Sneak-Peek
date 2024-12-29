async function searchSneakers() {
  const sku = document.getElementById('skuInput').value.trim();
  const baseUrl =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/sneakers' // Local backend URL
    : 'https://sneak-peek-seven.vercel.app/api/sneakers'; // Deployed Vercel URL

  if (!sku) {
    alert('Please enter a valid SKU!');
    return;
  }

  try {
    const response = await fetch(`${baseUrl}?sku=${sku}`);
    if (!response.ok) {
      throw new Error('Sneaker not found');
    }

    const data = await response.json();
    console.log('Data received:', data);

    // Extract product details
    const product = data.product;
    if (!product) throw new Error('Invalid product data received');

    // Map data to UI
    document.getElementById('sneakerName').innerText = product.name || 'Sneaker Not Found';
    document.getElementById('sneakerImage').src = product.thumbnail_url || 'default_image.png';
    document.getElementById('retailPrice').innerText = product.price ? `$${product.price}` : 'N/A';
    document.getElementById('lowestAsk').innerText = product.lowest_ask ? `$${product.lowest_ask}` : 'N/A';
    document.getElementById('highestBid').innerText = product.highest_bid ? `$${product.highest_bid}` : 'N/A';
    document.getElementById('salesLast72').innerText = product.sales_last_72 || 'N/A';
    document.getElementById('deadstockSold').innerText = product.deadstock_sold || 'N/A';
    document.getElementById('releaseDate').innerText = product.release_date || 'N/A';

    // Recommendation logic
    const recommendation = getRecommendation(product);
    updateRecommendationUI(recommendation);
  } catch (error) {
    console.error('Error:', error.message);
    resetUI();
  }
}

function resetUI() {
  console.log('Resetting UI...');
  document.getElementById('sneakerName').innerText = 'Sneaker Not Found';
  document.getElementById('sneakerImage').src = 'default_image.png';
  document.getElementById('retailPrice').innerText = 'N/A';
  document.getElementById('lowestAsk').innerText = 'N/A';
  document.getElementById('highestBid').innerText = 'N/A';
  document.getElementById('salesLast72').innerText = 'N/A';
  document.getElementById('deadstockSold').innerText = 'N/A';
  document.getElementById('releaseDate').innerText = 'N/A';
  updateRecommendationUI('Not enough data');
}

function getRecommendation(product) {
  const { highest_bid, price } = product;
  if (!highest_bid || !price) return 'Not enough data';

  const profitMargin = highest_bid - price;
  if (profitMargin > 50) return 'Sell Now';
  if (profitMargin < 20) return 'Hold for Now';
  return 'Monitor Closely';
}

function updateRecommendationUI(recommendation) {
  const recommendationElement = document.getElementById('recommendation');
  recommendationElement.textContent = `Recommendation: ${recommendation}`;

  // Add styling based on recommendation
  recommendationElement.className = 'recommendation'; // Reset class
  if (recommendation === 'Sell Now') {
    recommendationElement.classList.add('sell');
  } else if (recommendation === 'Monitor Closely') {
    recommendationElement.classList.add('monitor');
  } else if (recommendation === 'Hold for Now') {
    recommendationElement.classList.add('hold');
  }
}

// Attach the search function to the button
document.getElementById('searchButton').addEventListener('click', searchSneakers);
