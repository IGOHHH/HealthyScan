
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, HealthRating, ProductCategory } from "../types";

// Schema for structured JSON output from Gemini
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    productName: { type: Type.STRING },
    category: { 
      type: Type.STRING, 
      enum: [
        ProductCategory.FOOD, 
        ProductCategory.BEAUTY, 
        ProductCategory.MEDICINE, 
        ProductCategory.UNKNOWN
      ] 
    },
    healthScore: { type: Type.INTEGER, description: "A score from 0 to 100 where 100 is perfectly healthy/safe." },
    summary: { type: Type.STRING, description: "A concise 2-3 sentence summary of the health impacts." },
    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
    ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key ingredients detected or inferred." },
    rating: {
      type: Type.STRING,
      enum: [
        HealthRating.TOXIC,
        HealthRating.BAD,
        HealthRating.NEUTRAL,
        HealthRating.GOOD,
        HealthRating.EXCELLENT
      ]
    }
  },
  required: ["productName", "category", "healthScore", "summary", "pros", "cons", "rating"]
};

/**
 * Analyzes a product image using Gemini 3 Pro to detect ingredients and assess health impact.
 */
export const analyzeProductImage = async (base64Image: string): Promise<AnalysisResult> => {
  // Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
  // The API key is assumed to be pre-configured and accessible via process.env.API_KEY.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Extract MIME type and clean base64 data
    let mimeType = "image/jpeg";
    let cleanBase64 = base64Image;

    if (base64Image.includes(";base64,")) {
      const parts = base64Image.split(";base64,");
      if (parts.length === 2) {
        cleanBase64 = parts[1];
        const prefix = parts[0]; 
        if (prefix.startsWith("data:")) {
          mimeType = prefix.substring(5);
        }
      }
    }

    // Use gemini-3-pro-preview for complex reasoning tasks like ingredient analysis
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: `Analyze this image. It is likely a food item, a beauty/skincare product, or a medicine. 
            Identify the product. Read any visible text or ingredients list. 
            Assess its healthiness, safety, and effectiveness.
            Provide a health score (0-100).
            Categorize it accurately.
            List pros and cons based on scientific knowledge of the ingredients.
            If it's toxic or has harmful additives, mark it as TOXIC or BAD.
            If it's organic, clean, or highly effective, mark it as GOOD or EXCELLENT.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema
      }
    });

    // Extract text from the response object directly using the .text property
    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    const msg = error.message || "Failed to analyze product.";
    if (msg.includes("API Key")) throw error;
    throw new Error("Failed to analyze product. Please try again with a clearer image or check your internet connection.");
  }
};
