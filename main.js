const fs = require('fs');

// Fetch Bitcoin price data for the past year
async function fetchBitcoinData() {
  const url = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365';
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Save the data to a JSON file
    fs.writeFileSync('bitcoin_data.json', JSON.stringify(data, null, 2));
    console.log('Bitcoin data saved to bitcoin_data.json');
  } catch (error) {
    console.error('Error fetching Bitcoin data:', error);
  }
}

// Function to get timestamps for the past year (one per day)
function getTimestampsForLastYear() {
  const now = new Date();
  const timestamps = [];
  for (let i = 0; i < 365; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    timestamps.push(Math.floor(date.getTime() / 1000)); // Convert to seconds
  }
  return timestamps;
}

// Fetch moon phase data from the API
async function fetchMoonPhases() {
  const timestamps = getTimestampsForLastYear();
  const chunkSize = 50; // Avoid sending too many requests in one URL
  const results = [];
  
  for (let i = 0; i < timestamps.length; i += chunkSize) {
    const chunk = timestamps.slice(i, i + chunkSize);
    const query = chunk.map(ts => `d[]=${ts}`).join('&');
    const url = `http://api.farmsense.net/v1/moonphases/?${query}`;
    console.log(`Fetching: ${url}`);
  
    const response = await fetch(url);
    const data = await response.json();
    results.push(...data);
  }
  
  return results;
}

// Save moon data to a file
async function saveMoonDataToFile() {
  const moonData = await fetchMoonPhases();
  fs.writeFileSync('moon_data.json', JSON.stringify(moonData, null, 2));
  console.log('Moon data saved to moon_data.json');
}

// Fetch and save data, then process the combined data
async function processData() {
  // First, fetch the Bitcoin data
  await fetchBitcoinData();
  
  // Then, fetch and save the moon phase data
  await saveMoonDataToFile();
  
  // Read moon data and Bitcoin price data
  const moonData = JSON.parse(fs.readFileSync('moon_data.json', 'utf8'));
  const bitcoinData = JSON.parse(fs.readFileSync('bitcoin_data.json', 'utf8'));

  // Convert moon TargetDate to milliseconds and combine data
  const combinedData = moonData.map(moonEntry => {
    const targetDateMs = parseInt(moonEntry.TargetDate, 10) * 1000;

    // Find the closest Bitcoin price by date
    const closestPriceEntry = bitcoinData.prices.reduce((closest, [timestamp, price]) => {
      const currentDiff = Math.abs(timestamp - targetDateMs);
      const closestDiff = Math.abs(closest.timestamp - targetDateMs);
      return currentDiff < closestDiff ? { timestamp, price } : closest;
    }, { timestamp: Infinity, price: null });

    return {
      ...moonEntry,
      BitcoinPrice: closestPriceEntry.price,
      BitcoinPriceDate: new Date(closestPriceEntry.timestamp).toISOString(),
    };
  });

  // Save the combined data to a new JSON file
  fs.writeFileSync('combined_data.json', JSON.stringify(combinedData, null, 2));
  console.log('Combined data saved to combined_data.json');
}

// Run the process
processData().catch(console.error);
