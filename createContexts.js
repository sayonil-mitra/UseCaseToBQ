import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const AUTH_TOKEN = process.env.TOKEN;
const API_URL = "https://ig.gov-cloud.ai/pi-context-service/v1.0/contexts";
const JSON_FILE_PATH = "./createdSchemas/contextQueries/izak.json"; // Path to your JSON file

// Function to extract schema IDs from a query
const extractSchemaIds = (query) => {
  const regex = /t_(\w+)_t/g;
  const schemaIds = [];
  let match;
  while ((match = regex.exec(query)) !== null) {
    schemaIds.push(match[1]);
  }
  return schemaIds;
};

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

// Function to create contexts based on JSON data
const createContexts = async () => {
  try {
    const contextsArray = await readJsonFile(JSON_FILE_PATH);

    for (const context of contextsArray) {
      const { name, query } = context;
      const schemaIds = extractSchemaIds(query);
      // Extract schema ID from context type definition

      // Create context payload
      const contextPayload = {
        name: name,
        desc: name,
        contextType: "SIMPLECONTEXt",
        tags: {
          BLUE: ["context"],
        },
        universes: [process.env.UNIVERSE_ID],
        type: {
          iContextType: "SimpleContext",
          schemaId: schemaIds[0],
          definition: {
            rawQuery: query,
            tables: [schemaIds[0]],
          },
        },
      };

        console.log(contextPayload);

      try {
        const response = await axios.post(API_URL, contextPayload, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        console.log(`Context created: ${name}`);
        console.log(response.data);
      } catch (error) {
        console.error(`Error creating context for "${name}": ${error.message}`);
      }
    }
  } catch (error) {
    console.error(`Error processing contexts: ${error.message}`);
  }
};

// Execute the function
createContexts();
