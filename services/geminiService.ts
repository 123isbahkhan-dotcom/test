import { GoogleGenAI, Type } from "@google/genai";
import { HouseSpecs, CostEstimate } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateArchitectureImage = async (specs: HouseSpecs, viewType: 'exterior' | 'interior' | 'garden'): Promise<string | null> => {
  try {
    const prompt = `
      Photorealistic architectural visualization of a ${specs.style} house in ${specs.city}, Pakistan.
      View: ${viewType}.
      
      Specifications:
      - Plot size: ${specs.plotSize} (${specs.dimensions})
      - Floors: ${specs.floors}
      - Exterior Color: ${specs.exteriorColor}
      - Layout style: ${specs.layout}
      - Features: ${specs.features}
      
      Environment & Context:
      - The house should be situated in a realistic Pakistani residential setting (e.g., Bahria Town, DHA, or generic upscale neighborhood in ${specs.city}).
      - Include local vegetation (Neem trees, palm trees, Bougainvillea) and realistic sky/lighting typical of Pakistan.
      - If 'exterior', show the front facade with gate and street view.
      - If 'interior', show a spacious living area or drawing room matching the style.
      
      Style: High-end architectural photography, 8k resolution, highly detailed materials (marble, tile, concrete).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        // responseMimeType and imageSize are not supported for flash-image, only aspectRatio
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};

export const generateCostEstimate = async (specs: HouseSpecs): Promise<CostEstimate | null> => {
  try {
    const prompt = `
      Generate a detailed construction cost estimate for a house in ${specs.city}, Pakistan.
      
      Specifications:
      - Plot Size: ${specs.plotSize} (${specs.dimensions})
      - Floors: ${specs.floors}
      - Style: ${specs.style}
      - Layout: ${specs.layout}
      - Finish Level: Premium/A+ Grade Construction.
      
      Task:
      - Provide a breakdown of costs (Grey structure, Finishing, Labor, Architecture fees, MEP works).
      - Costs must be in PKR (Pakistani Rupee).
      - Base estimates on current 2024-2025 market rates in Pakistan (cement, steel, labor rates).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            currency: { type: Type.STRING },
            totalEstimatedCost: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as CostEstimate;
  } catch (error) {
    console.error("Cost estimation failed:", error);
    return null;
  }
};

export const findLocalPros = async (city: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find top rated, real-world ${category} in ${city}, Pakistan. 
      List 5 specific businesses or professionals with their actual addresses/locations if possible.
      Explain why they are recommended for residential construction.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: 30.3753, // Generic center of Pakistan, the tool will focus on the city query
              longitude: 69.3451
            }
          }
        }
      }
    });
    
    return {
      text: response.text,
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Local pros search failed:", error);
    throw error;
  }
};