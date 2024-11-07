import { GoogleGenerativeAI } from "@google/generative-ai"
import { schema } from "./Constants";
import { SynthConfig } from "../synth/Types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
  systemInstruction: `
  Always change all settings.

  Make 2 unisons.`,
});


export function prompt(message: string): Promise<SynthConfig> {
  return model.generateContent(message)
    .then(
      (result) => {
        return result.response.text();
      }
    )
    .then(
      (text) => {
        return JSON.parse(text);
      }
    )
}