import express from "express";
import getSchemaDefinition from "./getSchemaDefinition.js";
import sendSchemaDefinition from "./sendSchemaDefinition.js";

const app = express();
const port = 3000; // Define the port number

// Middleware to parse JSON request bodies
app.use(express.json());

// API endpoint to handle schema ID and use case string
app.post("/bq", async (req, res) => {
  const { schemaId, useCase } = req.body;

  if (!schemaId || !useCase) {
    return res.status(400).json({ error: "schemaId and useCase are required" });
  }

  try {
    // Step 1: Get schema definition
    const schemaDefinition = await getSchemaDefinition(schemaId);

    // Step 2: Send schema definition to the next service
    const response = await sendSchemaDefinition(
      schemaId,
      schemaDefinition,
      useCase
    );

    // Send the response back to the client
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing the schema" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
