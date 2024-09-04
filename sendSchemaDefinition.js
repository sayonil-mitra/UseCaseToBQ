import axios from "axios";

// Function to send the schema definition to another service
export default async function sendSchemaDefinition(
  schemaId,
  schemaDefinition,
  useCase
) {
  try {
    // Define the headers for the POST request
    const headers = {
      "Content-Type": "application/json",
    };
    console.log("Calling BQ Agent");
    // Create the request payload
    const payload = {
      user_id: "Gaian@123",
      assistant_id: "asst_Eg6lq98HQT7Mwhy3fesmCwjy",
      thread_id: "",
      file_id: "",
      input: `Canonical schema id: ${schemaId}. Canonical schema definition: ${schemaDefinition}. Use case: ${useCase}. Do not send any helper text. Just send array of BQ queries according to your instruction set`,
      model: "",
    };

    // Make the POST request to send the schema definition and other data
    const response = await axios.post(
      "https://ig.gov-cloud.ai/mobius-gpt-service/response",
      payload,
      {
        headers: headers,
      }
    );
    console.log("BQ Agent responded successfully");
    let agentResponse = JSON.parse(response.data.messages[0].content)
    return agentResponse;
  } catch (error) {
    console.error("Error sending schema definition:", error.message);
    throw error;
  }
}
