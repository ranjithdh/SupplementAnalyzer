import { GoogleGenAI, Type } from "@google/genai";
import { ScrapedData } from "../types";

// Define the schema programmatically with DESCRIPTIONS to enforce strict behavior
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    products: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, nullable: true },
          brand: { type: Type.STRING, nullable: true },
          price: {
            type: Type.OBJECT,
            properties: {
              amount: { type: Type.NUMBER, nullable: true },
              currency: { type: Type.STRING, nullable: true },
              unitType: { type: Type.STRING, nullable: true },
              pricePerUnit: { type: Type.NUMBER, nullable: true },
              totalRatings: { type: Type.NUMBER, nullable: true },
              averageRating: { type: Type.NUMBER, nullable: true },
              unitsPerContainer: { type: Type.NUMBER, nullable: true }
            },
            required: ["amount", "currency"]
          },
          imageUrls: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          productId: { type: Type.STRING, nullable: true },
          is_trusted: { type: Type.BOOLEAN },
          productUrl: { type: Type.STRING, nullable: true },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                unit: { type: Type.STRING },
                amount: { type: Type.NUMBER }
              },
              required: ["name", "unit", "amount"]
            }
          },
          recommendation: {
            type: Type.OBJECT,
            properties: {
              reason: { type: Type.STRING },
              priority: { type: Type.NUMBER }
            },
            required: ["reason", "priority"]
          },
          nutritionalFacts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                unit: { type: Type.STRING },
                amount: { type: Type.NUMBER }
              },
              required: ["name", "unit", "amount"]
            }
          },
          productIngredientList: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["name", "brand", "price", "imageUrls", "is_trusted", "ingredients", "recommendation", "nutritionalFacts", "productIngredientList"]
      }
    }
  },
  required: ["products"],
};

export const analyzeUrl = async (url: string, imageUrl?: string): Promise<ScrapedData> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are an expert Data Extraction AI specializing in dietary supplements.
    Your goal is to extract structured information for ALL products found on a page.
    
    CRITICAL RULES:
    1. PRICE: Extract numeric values for 'amount' and 'pricePerUnit'. 'currency' should be ISO code (e.g., "INR", "USD").
    2. IMAGE URLS: Collect ALL relevant product images and supplement fact label images.
    3. INGREDIENTS & NUTRITIONAL FACTS: 
       - 'ingredients' are active components with units (e.g., "Vitamin D", "10000", "IU").
       - 'nutritionalFacts' are items from the Supplement Facts panel.
       - 'productIngredientList' is the 'Other Ingredients' text, split into a list of strings.
    4. RECOMMENDATION: Synthesize a brief 'reason' (e.g., "Gluten Free • Heart Health") and assign a 'priority' (1 for excellent, higher for less relevant).
    5. TRUSTED: Set 'is_trusted' to true only if the evidence for ingredients and quality is strong.
    6. SEARCH: Use Google Search to verify details, find missing prices, or locate high-quality label images if the source is unclear.
    7. OUTPUT ONLY VALID JSON.
  `;

  const prompt = `Analyze this URL for supplement products: ${url}. 
  
  1. GROUNDING: Use Google Search to find accurate nutritional facts, ingredient lists, and prices if they are incomplete on the page.
  2. IMAGES: Find and include URLs for product images and Supplement Facts labels.
  3. EXTRACTION: For EVERY product found, extract:
     - Name and Brand
     - Full Price info (Amount, Currency, etc.)
     - Ingredients (Active components with amounts)
     - Nutritional Facts (from the fact table)
     - Full Ingredient List (Other ingredients)
  4. RECOMMENDATION: Brief health-focused reasons and priority.
  
  Return the results as a JSON object with a 'products' array.`;

  try {
    // Build content array based on whether image URL is provided
    const contents: any[] = [{ text: prompt }];

    if (imageUrl) {
      // Determine MIME type from URL extension
      const mimeType = imageUrl.toLowerCase().endsWith('.png')
        ? 'image/png'
        : imageUrl.toLowerCase().endsWith('.webp')
          ? 'image/webp'
          : 'image/jpeg';

      // Pass image URL directly to Gemini (it will fetch it)
      contents.push({
        fileData: {
          fileUri: imageUrl,
          mimeType: mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Use a more stable model for now to rule out model-specific 500s
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    let text = response.text;
    if (!text) throw new Error("No response generated");

    // Robust cleaning
    text = text.replace(/```json\s*/g, "").replace(/```/g, "");
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(text) as ScrapedData;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};