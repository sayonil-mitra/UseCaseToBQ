import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const AUTH_TOKEN = process.env.TOKEN;
const API_URL = "https://ig.gov-cloud.ai/pi-entity-service/v1.0/schemas";
const JSON_FILE_PATH = "./schemaDefinitions/izak2.json";
const OUTPUT_FILE_PATH = "./response_data.txt";

// Function to read JSON file
const readJsonFile = async (filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file: ${error.message}`);
    throw error;
  }
};

// Function to make API calls and store responses
const makeApiCalls = async () => {
  try {
    const requestDataArray = await readJsonFile(JSON_FILE_PATH);

    for (const requestBody of requestDataArray) {
      try {
        const response = await axios.post(API_URL, requestBody, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        setTimeout(() => {}, 300);

        const { schemaId, entitySchema } = response.data;
        const responseData = `schemaId: ${schemaId}, entitySchema.name: ${entitySchema.name}\n`;
        console.log(schemaId);
        // Append data to the text file
        await fs.promises.appendFile(OUTPUT_FILE_PATH, responseData);

        console.log(`Data appended to file: ${responseData}`);
      } catch (error) {
        console.error(`Error making API call: ${error.message}`);
      }
    }
  } catch (error) {
    console.error(`Error processing API calls: ${error.message}`);
  }
};

// Execute the function
makeApiCalls();
