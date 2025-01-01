import { Hono } from "hono";

// Define the types for the response structure
interface GeminiResponse {
  candidates: {
    content: { [key: string]: any }; // Use a more flexible type here to capture any structure
    finishReason: string;
    avgLogprobs: number;
  }[];
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
  modelVersion: string;
}

// Define the Hono request context type for proper type checking
interface BlogRouterContext {
  Bindings: {
    DATABASE_URL: string;
    GEMINI_API_KEY: string;
  };
}

export const aiRouter = new Hono();
export const blogRouter = new Hono<BlogRouterContext>();

// Function to generate text based on a prompt using Gemini API
const generateText = async (
  prompt: string,
  apiKey: string
): Promise<string> => {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      apiKey,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt, // The user input text
              },
            ],
          },
        ],
      }),
    }
  );

  // Check if the response is not OK (status codes other than 2xx)
  if (!response.ok) {
    const errorDetails = await response.text(); // Capture the HTML error page for debugging
    throw new Error(
      `Gemini API request failed: ${response.statusText} - ${errorDetails}`
    );
  }

  // Now we can safely assume the response is JSON
  const data: GeminiResponse = await response.json();

  // Log the full response for debugging purposes
  console.log("Full API Response:", data);

  // Check if the expected data is present in candidates
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error("Unexpected response structure from Gemini API.");
  }

  // Log the content object to inspect its structure
  console.log("Content Object:", data.candidates[0].content);

  // Extract text from the 'parts' array in the response content
  const generatedText = data.candidates[0].content.parts
    .map((part: { text: string }) => part.text) // Join all text parts
    .join("\n")
    .trim();

  // If `text` is not found, attempt to log the available properties
  if (!generatedText) {
    const contentKeys = Object.keys(data.candidates[0].content);
    throw new Error(
      `No generated text found in the response. Available keys in content: ${contentKeys.join(
        ", "
      )}`
    );
  }

  return generatedText;
};

aiRouter.post("/title", async (c: any) => {
  const body = await c.req.json();
  const text = body.content;

  if (!text) {
    return c.json({ message: "Content is required" }, 400);
  }

  try {
    const prompt = `${text}\nGenerate a starting line over this title:`;
    const responseText = await generateText(prompt, c.env.GEMINI_API_KEY);
    return c.json({ suggestions: responseText });
  } catch (e: any) {
    console.error("Error:", e);
    return c.json(
      { message: "Error while fetching title suggestions", error: e.message },
      500
    );
  }
});

aiRouter.post("/line", async (c: any) => {
  const body = await c.req.json();
  const text = body.content;

  if (!text) {
    return c.json({ message: "Content is required" }, 400);
  }

  try {
    const prompt = `${text}\nContinue this line and no unnecessary texts:`;
    const responseText = await generateText(prompt, c.env.GEMINI_API_KEY);
    return c.json({ suggestions: responseText });
  } catch (e: any) {
    console.error("Error:", e);
    return c.json(
      { message: "Error while fetching line suggestions", error: e.message },
      500
    );
  }
});
