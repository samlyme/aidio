export type WaveForm = "sine" | "square" | "triangle" | "sawtooth";

export type MIDINote = number;

export type MIDIVelocity = number;

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

export type FilterEnvelope = ADSREnvelope & {
    frequencyMin: number,
    frequencyMax: number,
}

export type EchoConfig = {
    delay: number,
    feedback: number,
}

export type SynthConfig = {
    waveForm: WaveForm,

    unisons: UnisonConfig[],

    filter: FilterConfig,

    volumeEnvelope: ADSREnvelope,

    // Filter envelope will go from frequencyMin to frequencyMax
    // Then sustain at filter.frequency
    // Then release to frequencyMin
    filterEnvelope: FilterEnvelope,

    echo: EchoConfig,
};

// TODO: Implement EffectsChain and NoteChain as a class for type safety
// - this shit is so cursed lmao
export type EchoNode = [DelayNode, GainNode];
export type EffectsChain = [GainNode, GainNode, BiquadFilterNode];

// NoteChain is the result of a note being played.
export type NoteChain = [OscillatorNode[], EffectsChain];