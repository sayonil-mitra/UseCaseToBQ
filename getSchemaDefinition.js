import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Function to get schema definition
export default async function getSchemaDefinition(schemaId) {
  try {
    // Define the headers for the GET request
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TOKEN}`, // Use environment variable for the token
    };

    // Make the GET request to fetch the schema definition
    const response = await axios.get(
      `https://ig.gov-cloud.ai/pi-entity-service/v1.0/schemas/${schemaId}`,
      {
        headers: headers,
      }
    );

    // Stringify the schema definition
    const schemaDefinition = JSON.stringify(response.data);

    console.log(`Schema definition fetched successfully: ${schemaId}`);
    return schemaDefinition;
  } catch (error) {
    console.error("Error fetching schema definition:", error.message);
    throw error;
  }
}
