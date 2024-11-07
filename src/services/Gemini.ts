import { GoogleGenerativeAI } from "@google/generative-ai"
import { schema } from "./Contants";
import { SynthConfig } from "../synth/Types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});


export async function prompt(message: string): Promise<SynthConfig> {
  const result = await model.generateContent(message);

  return JSON.parse(result.response.text());
}