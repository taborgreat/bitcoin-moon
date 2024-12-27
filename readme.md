# Moon Phases vs Bitcoin Prices

## Purpose

The purpose of this project is to compare moon phases to Bitcoin prices in an attempt to find a correlation between the two. After analyzing the data, I could find no significant correlation between moon phase and Bitcoin prices.

## How to Use

### Step 1: Run the `main.js` file

The `main.js` file fetches data from two APIs: one for Bitcoin prices and another for moon phases. It then processes and saves the data as JSON files. To run the script:

1. Ensure you have **Node.js** installed on your machine.
2. No additional dependencies are required, as the script uses the built-in `fs` module.
3. Run the script:

 ```
node main.js
 ```


This will fetch the data and create three JSON files:
- `bitcoin_data.json` (contains Bitcoin price data for the last 365 days)
- `moon_data.json` (contains moon phase data for the same period)
- `combined_data.json` (contains the merged data with Bitcoin prices and moon phases)

### Step 2: Serve the HTML file

After running the script and generating the JSON files, you can visualize the data in a chart by opening the `index.html` file in a local server.
