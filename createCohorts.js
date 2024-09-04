import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const AUTH_TOKEN = process.env.TOKEN;
const API_URL = "https://ig.gov-cloud.ai/pi-cohorts-service/v1.0/cohorts";
const JSON_FILE_PATH = "./createdSchemas/cohort queries/izakSql.json"; // Path to your JSON file

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

// Function to create cohorts based on JSON data
const createCohorts = async () => {
  try {
    const queriesArray = await readJsonFile(JSON_FILE_PATH);

    for (const queryObject of queriesArray) {
      const { name, query } = queryObject;

      // Extract schema IDs from the query
      const schemaIds = extractSchemaIds(query);

      // Create cohort payload
      const cohortPayload = {
        name: name,
        desc: name,
        readAccess: "PUBLIC",
        schemaId: schemaIds[0], // Assuming only one schema ID per query
        definition: {
          rawQuery: query,
          tables: [schemaIds[0]],
        },
        universes: [process.env.UNIVERSE_ID],
        tags: {
          RED: ["Cohorts"],
        },
      };

      try {
        const response = await axios.post(API_URL, cohortPayload, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        console.log(`Cohort created: ${name}`);
        console.log(response.data);
      } catch (error) {
        console.error(
          `Error creating cohort for query "${name}": ${error}`
        );
      }
    }
  } catch (error) {
    console.error(`Error processing queries: ${error}`);
  }
};

// Execute the function
createCohorts();
