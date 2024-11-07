export const schema = JSON.parse(`{
    "type": "object",
    "properties": {
        "waveForm": {
            "type": "string",
            "enum": [
                "sine",
                "square",
                "triange",
                "sawtooth"
            ]
        },
        "unisons": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "enabled": {
                        "type": "boolean"
                    },
                    "waveForm": {
                        "type": "string",
                        "enum": [
                            "sine",
                            "square",
                            "triangle",
                            "sawtooth"
                        ]
                    },
                    "detune": {
                        "type": "number"
                    },
                    "gain": {
                        "type": "number"
                    }
                }
            }
        },
        "filter": {
            "type": "object",
            "properties": {
                "frequency": {
                    "type": "number"
                },
                "resonance": {
                    "type": "number"
                }
            }
        },
        "volumeEnvelope": {
            "type": "object",
            "properties": {
                "attack": {
                    "type": "number"
                },
                "decay": {
                    "type": "number"
                },
                "sustain": {
                    "type": "number"
                },
                "release": {
                    "type": "number"
                }
            }
        },
        "filterEnvelope": {
            "type": "object",
            "properties": {
                "attack": {
                    "type": "number"
                },
                "decay": {
                    "type": "number"
                },
                "sustain": {
                    "type": "number"
                },
                "release": {
                    "type": "number"
                },
                "frequencyMin": {
                    "type": "number"
                }
            }
        },
        "echo": {
            "type": "object",
            "properties": {
                "delay": {
                    "type": "number"
                },
                "feedback": {
                    "type": "number"
                }
            }
        }
    }
}`);