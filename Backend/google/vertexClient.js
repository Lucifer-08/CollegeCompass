const { PredictionServiceClient } = require('@google-cloud/aiplatform');
const { helpers } = require('@google-cloud/aiplatform');

// Constants from your environment
const PROJECT = process.env.GOOGLE_PROJECT_ID;
const LOCATION = "us-central1"; 
const MODEL_NAME = "text-embedding-004";

// Initialize the Prediction Client
const client = new PredictionServiceClient({
  apiEndpoint: `${LOCATION}-aiplatform.googleapis.com`,
});

module.exports = async function getEmbedding(text, retries = 3, delay = 2000) {
  // Construct the resource name for the model
  const endpoint = `projects/${PROJECT}/locations/${LOCATION}/publishers/google/models/${MODEL_NAME}`;

  // Formatting the request for the Prediction Service
  const instance = helpers.toValue({ content: text });
  const instances = [instance];
  const parameter = helpers.toValue({ autoTruncate: true });

  for (let i = 0; i < retries; i++) {
    try {
      const [response] = await client.predict({
        endpoint,
        instances,
        parameters: parameter,
      });

      // The embedding values are nested inside the predictions array
      const predictions = response.predictions;
      if (!predictions || predictions.length === 0) {
        throw new Error("No predictions returned from Vertex AI");
      }

      // Convert the protobuf value back to a standard JavaScript array
      const result = helpers.fromValue(predictions[0]);
      return result.embeddings.values;

    } catch (err) {
      const isLastAttempt = i === retries - 1;

      console.error(`Attempt ${i + 1} Error:`);   

      if (isLastAttempt) throw err;

      // Exponential backoff delay
      const waitTime = delay * (i + 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};