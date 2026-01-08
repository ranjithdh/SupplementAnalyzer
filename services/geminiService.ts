import { GoogleGenAI, Type } from "@google/genai";
import { ScrapedData } from "../types";

// Define the schema programmatically with DESCRIPTIONS to enforce strict behavior
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    pageType: { type: Type.STRING, enum: ["product", "service", "content", "unknown"] },
    metadata: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, nullable: true },
        metaDescription: { type: Type.STRING, nullable: true },
        canonicalUrl: { type: Type.STRING, nullable: true },
        language: { type: Type.STRING, nullable: true },
      },
    },
    coreEntity: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, nullable: true },
        brand: { type: Type.STRING, nullable: true },
        category: { type: Type.STRING, nullable: true },
        image: { type: Type.STRING, nullable: true },
      },
    },
    productDetails: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        price: {
            type: Type.OBJECT,
            nullable: true,
            properties: {
                amount: { type: Type.STRING, nullable: true },
                currency: { type: Type.STRING, nullable: true }
            }
        },
        description: { type: Type.STRING, nullable: true },
        specifications: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              value: { type: Type.STRING }
            }
          }
        },
        nutritionalInformation: {
          type: Type.ARRAY,
          description: "An exhaustive list of EVERY nutrient, herb, oil, or ingredient that has an associated numeric amount (e.g., weight, volume, calories, or percentage). Extract from ALL tables including 'Supplement Facts', 'Nutritional Information', and 'Approx Value'.",
          items: {
            type: Type.OBJECT,
            properties: {
              element: { 
                type: Type.STRING,
                description: "The name of the nutrient or ingredient ONLY (e.g. 'Vitamin C', 'DHA'). DO NOT include descriptions, parenthetical notes, or source information."
              },
              amount: { 
                type: Type.STRING,
                description: "The numeric amount and unit (e.g. '500 mg', '10 g', '73.6 Kcal'). Must contain a digit."
              },
              dailyValue: { type: Type.STRING, nullable: true, description: "The % Daily Value (e.g. '50%', '100%')." }
            },
            required: ["element", "amount"]
          }
        },
        suggestedUse: { type: Type.STRING, nullable: true },
        ingredients: { 
          type: Type.STRING, 
          nullable: true,
          description: "A comma-separated list of ingredients that DO NOT have associated numeric amounts. If an item has a weight/value next to it, it MUST be in nutritionalInformation instead."
        },
        warnings: { type: Type.STRING, nullable: true },
        disclaimer: { type: Type.STRING, nullable: true },
        labelImage: { type: Type.STRING, nullable: true }
      }
    },
    contentDetails: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        author: { type: Type.STRING, nullable: true },
        publishDate: { type: Type.STRING, nullable: true },
        mainContent: { type: Type.STRING, nullable: true },
        headings: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    }
  },
  required: ["pageType", "metadata", "coreEntity"],
};

export const analyzeUrl = async (url: string, imageUrl?: string): Promise<ScrapedData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are an expert Data Extraction AI. 
    Your goal is to extract structured information from web pages, with a high focus on "Supplement Facts" and "Nutritional Information" labels.
    
    CRITICAL RULES:
    1. PRICE: Extract the EXACT numeric price into 'amount' and the currency symbol or code (e.g., "$", "INR", "USD") into 'currency'. Look for discounted prices.
    2. NUTRIENTS: Extract ALL items from ANY tables or lists that have numeric weights, amounts, or calories (e.g., "73.6 Kcal", "500 mg", "10 g", "0.40 g"). If an item has a numeric value associated with it, it MUST go into 'nutritionalInformation', NOT 'ingredients'.
    3. MANDATORY FIELDS: Every entry in 'nutritionalInformation' MUST have both 'element' and 'amount'. If an amount is missing, move the item to 'ingredients'.
    4. CONCISENESS: The 'element' name must be just the substance name (e.g., "DHA"). DO NOT include descriptions, parenthetical details, source notes, or headers like "Amount Per Serving".
    5. TABLE SOURCES: Treat 'Approx Value', 'Supplement Facts', 'Nutritional Information', and 'Composition' as sources for nutritionalInformation.
    6. SEARCH FOR IMAGES: Use your Google Search tool to specifically look for the direct URL of the "Supplement Facts" or "Nutritional Information" label image for this specific product.
    7. DATA FROM SEARCH: Use Google Search to find any nutritional data or ingredient lists that are missing or hard to read on the provided page (especially if they are in images).
    8. ZERO SUMMARIZATION: Every single row in a table or list must be its own object in the array. Do not group multiple nutrients into one string.
    9. NO MARKETING: Ignore marketing counts (e.g., "16 science-driven ingredients") in the nutritionalInformation section.
    10. SUB-ITEMS & BLENDS: Include ALL items, including indented sub-items and members of a "Proprietary Formulation" or blend, especially if they have weights/amounts.
    11. INGREDIENTS: Use the 'ingredients' field ONLY for items that DO NOT have an associated weight, amount, or numeric value. Format as a comma-separated list.
    12. VALIDATION: Output ONLY pure JSON matching the provided schema.
  `;

  const prompt = `Analyze the product at this URL: ${url}. 
  
  1. GROUNDING: Use Google Search to find the product's official nutritional information and ingredients if the provided URL is missing information or presents it only in images.
  2. IMAGE ADDRESS: Specifically look for the direct image address (URL) of the Supplement Facts or Nutritional Information chart. If found, include it in the 'labelImage' field.
  3. PRICE: Identify the current price and currency.
  4. AUDIT: Perform a row-by-row extraction of EVERY substance with a numeric value found in text, images (via OCR/Search), or grounding results.
  5. CLEANING: Ensure 'element' names are short substance names only.
  6. RULES: Do NOT summarize. Every item with a value MUST be in 'nutritionalInformation'.
  
  Return the results strictly following the JSON schema.`;

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
      model: "gemini-3-flash-preview",
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