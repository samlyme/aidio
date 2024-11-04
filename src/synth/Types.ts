export type WaveForm = "sine" | "square" | "triangle" | "sawtooth";

export type UnisonConfig = { enabled: false } | {
    enabled: true,
    waveForm: WaveForm,
    detune: number,
    gain: number,
};

export type FilterConfig = {
    frequency: number,
    resonance: number,
}

export type ADSREnvelope = {
    attack: number,
    decay: number,
    sustain: number,
    release: number,
};

export type SynthConfig = {
    waveForm: WaveForm,

    unisons: UnisonConfig[],

    filter: FilterConfig,

    volumeEnvelope: ADSREnvelope,

    filterEnvelope: ADSREnvelope,
};

export type NoteChain = [OscillatorNode[], GainNode, GainNode, BiquadFilterNode];