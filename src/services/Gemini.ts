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

  Make 2 unisons.

  Attack, Decay, and Release should have values between 0 and 2.
  Sustain should have a value between 0 and 1.
  
  Gain is a value between 0 and 1.
  Detune is a value between 0 and 10.
  If a user ask for an open sound, set detune to 7, attack decay and release to a value between 0.7 and 2, and echo feedback to 0.4.
  Filter frequency should be set between 1000 and 7000
  Plucky sounds require attack and decay set to 0.03, sustain to 0.1, and release to 0.7.
  Aggressive sounds should have filter set to a value between 10000 and 15000.
  `,
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