from flask import Flask
from flask import request
import google.generativeai as genai
import json
import configparser

app = Flask(__name__)

def get_api_key() -> str:
    config = configparser.ConfigParser()
    config.read('config.ini')

    return config['GEMINI']['API_KEY']


def get_gemini_response(custom_description:str='') :
    genai.configure(api_key=get_api_key())
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={"response_mime_type": "application/json"}
    )

    if custom_description:
        custom_description = f'with the features {custom_description}'

    default_config = """
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
        """
    prompt = f"Generate me parameters for a random synth {custom_description} and format it based on the example format specified. Please limit the output to JSON only: {default_config}"

    response = model.generate_content(prompt)

    return json.loads(response.text)


@app.route("/random-synth")
def generate_random_synth():
    return get_gemini_response()


@app.route("/generate-synth")
def generate_synth():

    details = request.args.get('details','')
    return get_gemini_response(details)