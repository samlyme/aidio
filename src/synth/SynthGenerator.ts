import {GoogleGenerativeAI} from "@google/generative-ai";

export default class SynthGenerator{

    private static model;
    private static defaultPrompt:string;

    constructor(){
        const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_KEY);
        SynthGenerator.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: {"responseMimeType": "application/json"} });

        SynthGenerator.defaultPrompt = `
        Generate me parameters for a random synth and format it based on the example format specified. Please limit the output to JSON only:
                Synth.config = {
                    waveForm: "triangle",

                    unisons: [
                        {
                            enabled: true,
                            waveForm: "triangle",
                            detune: 5,
                            gain: 0.8,
                        },
                        { enabled: false }
                    ],

                    filter: {
                        frequency: 5000,
                        resonance: 30,
                    },

                    volumeEnvelope: {
                        attack: 1 * MAX_STAGE_TIME,
                        decay: 1 * MAX_STAGE_TIME,
                        sustain: 0.5,
                        release: 1 * MAX_STAGE_TIME,
                    },

                    filterEnvelope: {
                        attack: 1 * MAX_STAGE_TIME,
                        decay: 1 * MAX_STAGE_TIME,
                        sustain: 0.5,
                        release: 1 * MAX_STAGE_TIME,
                        frequencyMin: 1000,
                        frequencyMax: 10000,
                    },

                    echo: {
                        delay: 0.5,
                        feedback: 0.5,
                    }
                }
        `;
    }


    static async generateRandomParameters(){
        const result = await SynthGenerator.model.generateContent(SynthGenerator.defaultPrompt);
        return result.response.text();
    }


}

console.log(SynthGenerator.generateRandomParameters());

