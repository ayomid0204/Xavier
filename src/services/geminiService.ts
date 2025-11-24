import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Initialize the Google GenAI SDK
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Store chat instance in memory to maintain history during the session
let chatSession: Chat | null = null;

export const initializeChat = () => {
  try {
    chatSession = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `You are the intelligent support assistant for "Xavier Gadget Hub", a premium electronics e-commerce store. 
        
        Your goal is to help customers find products, answer questions about our policies, and provide technical specs.
        
        Key Info:
        - We sell Phones, Laptops, Routers, Watches, Speakers (specializing in JBL), and Accessories.
        - We offer free shipping on orders over $500.
        - We have a 30-day return policy.
        - Contact support email is support@xaviergadgethub.com.
        
        Be concise, friendly, and helpful. If you don't know specific stock levels, ask them to check the product page.`,
      },
    });
  } catch (error) {
    console.error("Failed to initialize Gemini chat:", error);
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    return "Sorry, I'm having trouble connecting to the AI service right now.";
  }

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({
      message: message,
    });
    
    return response.text || "I didn't catch that. Could you rephrase?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently experiencing high traffic. Please try again in a moment.";
  }
};