const csv = require("csvtojson");
const fs = require("fs");
const path = require("path");

// Paths for CSV input and JSON output
const csvFilePath = path.join(__dirname, "../assets/top_10000_1960-now.csv");
const jsonFilePath = path.join(__dirname, "../seeds/musicData.json");

// Function to convert CSV to JSON
async function convertCsvToJson(csvFilePath, jsonFilePath) {
  try {
    const jsonArray = await csv().fromFile(csvFilePath);
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 4));
    console.log(
      `CSV data has been successfully converted to JSON and saved to ${jsonFilePath}`
    );
  } catch (error) {
    console.error("Error converting CSV to JSON:", error);
  }
}

// Execute the conversion
convertCsvToJson(csvFilePath, jsonFilePath);
