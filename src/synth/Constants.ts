import { SynthConfig, WaveForm } from "./Types"

export const DEFAULT_WAVEFORM: WaveForm = "sawtooth";
export const DEFAULT_UNISON0_WAVEFORM: WaveForm = "square";
export const DEFAULT_UNISON1_WAVEFORM: WaveForm = "triangle";

export const MAX_STAGE_TIME: number = 2;
export const MIN_STAGE_TIME: number = 0;
export const DEFAULT_STAGE_TIME: number = 0.2;

export const MAX_DELAY_TIME: number = 2;
export const MIN_DELAY_TIME: number = 0;
export const DEFAULT_DELAY_TIME: number = 0.2;

export const MAX_MASTER_VOLUME: number = 1;
export const MIN_MASTER_VOLUME: number = 0;
export const DEFAULT_MASTER_VOLUME: number = 1;

// Filter Frequency (in Hz)
export const MAX_FILTER_FREQUENCY: number = 20000;  // 20 kHz, upper limit of human hearing
export const MIN_FILTER_FREQUENCY: number = 100;     // 20 Hz, lower limit of human hearing
export const DEFAULT_FILTER_FREQUENCY: number = 1000;  // 1 kHz, common mid-range frequency

// Filter Resonance (Q factor)
export const MAX_FILTER_RESONANCE: number = 20;
export const MIN_FILTER_RESONANCE: number = 0.1;
export const DEFAULT_FILTER_RESONANCE: number = 1;  // Common starting resonance value

// Filter Envelope Attack Time (in seconds)
export const MAX_FILTER_ATTACK: number = 2;    // 2 seconds for long attack
export const MIN_FILTER_ATTACK: number = 0;
export const DEFAULT_FILTER_ATTACK: number = 0.1;   // Short attack for snappy sound

// Filter Envelope Decay Time (in seconds)
export const MAX_FILTER_DECAY: number = 2;
export const MIN_FILTER_DECAY: number = 0;
export const DEFAULT_FILTER_DECAY: number = 0.5;   // Medium decay

// Filter Envelope Sustain Level (0 to 1)
export const MAX_FILTER_SUSTAIN: number = 1;
export const MIN_FILTER_SUSTAIN: number = 0;
export const DEFAULT_FILTER_SUSTAIN: number = 0.7;   // Moderate sustain

// Filter Envelope Release Time (in seconds)
export const MAX_FILTER_RELEASE: number = 2;
export const MIN_FILTER_RELEASE: number = 0;
export const DEFAULT_FILTER_RELEASE: number = 0.5;   // Medium release time

// Volume Envelope Attack Time (in seconds)
export const MAX_VOLUME_ATTACK: number = 2;    // 2 seconds for long attack
export const MIN_VOLUME_ATTACK: number = 0;
export const DEFAULT_VOLUME_ATTACK: number = 0.1;   // Short attack for snappy sound

// Volume Envelope Decay Time (in seconds)
export const MAX_VOLUME_DECAY: number = 2;
export const MIN_VOLUME_DECAY: number = 0;
export const DEFAULT_VOLUME_DECAY: number = 0.5;   // Medium decay

// Volume Envelope Sustain Level (0 to 1)
export const MAX_VOLUME_SUSTAIN: number = 1;
export const MIN_VOLUME_SUSTAIN: number = 0;
export const DEFAULT_VOLUME_SUSTAIN: number = 0.7;   // Moderate sustain

// Volume Envelope Release Time (in seconds)
export const MAX_VOLUME_RELEASE: number = 2;
export const MIN_VOLUME_RELEASE: number = 0;
export const DEFAULT_VOLUME_RELEASE: number = 0.5;   // Medium release time

// Echo Delay Time (in seconds)
export const MAX_ECHO_DELAY: number = 1;     // 2 seconds for longer echo delay
export const MIN_ECHO_DELAY: number = 0;
export const DEFAULT_ECHO_DELAY: number = 0;  // Default of 0.3 seconds for a moderate echo effect

// Echo Feedback (ratio, 0 to 1)
export const MAX_ECHO_FEEDBACK: number = 1;    // 1 (100%) for full feedback, creating an infinite loop
export const MIN_ECHO_FEEDBACK: number = 0;
export const DEFAULT_ECHO_FEEDBACK: number = 0  // 0.5 (50%) for a balanced feedback level

// Detune Amount (in cents)
export const MAX_DETUNE: number = 100;
export const MIN_DETUNE: number = 0;
export const DEFAULT_DETUNE: number = 0;     // No detune as default

export const DEFAULT_SYNTH_CONFIG: SynthConfig = {
    waveForm: DEFAULT_WAVEFORM,

    unisons: [
        {
            enabled: true,
            waveForm: DEFAULT_UNISON0_WAVEFORM,
            detune: DEFAULT_DETUNE,
            gain: 0.8,
        },
        {
            enabled: true,
            waveForm: DEFAULT_UNISON1_WAVEFORM,
            detune: DEFAULT_DETUNE,
            gain: 0.8,
        }
    ],

    filter: {
        frequency: DEFAULT_FILTER_FREQUENCY,
        resonance: DEFAULT_FILTER_RESONANCE,
    },

    volumeEnvelope: {
        attack: DEFAULT_VOLUME_ATTACK,
        decay: DEFAULT_VOLUME_DECAY,
        sustain: DEFAULT_VOLUME_SUSTAIN,
        release: DEFAULT_VOLUME_RELEASE,
    },

    filterEnvelope: {
        attack: DEFAULT_FILTER_ATTACK,
        decay: DEFAULT_FILTER_DECAY,
        sustain: DEFAULT_FILTER_SUSTAIN,
        release: DEFAULT_FILTER_RELEASE,
        frequencyMin: MIN_FILTER_FREQUENCY,
    },

    echo: {
        delay: DEFAULT_ECHO_DELAY,
        feedback: DEFAULT_ECHO_FEEDBACK,
    }
}