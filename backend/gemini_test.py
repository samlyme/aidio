import os
import google.generativeai as genai
import os

genai.configure(api_key='AIzaSyDBGg98zBfsCE3j2hle5BI0wjR84dTi7nE')
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config={"response_mime_type": "application/json"}
    )
response = model.generate_content("""
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

""")
print(response.text)