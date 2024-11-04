export type WaveForm = "sine" | "square" | "triangle" | "sawtooth";

export type UnisonConfig = { enabled: boolean } | {
    waveFor: WaveForm,
    detune: number,
    gain: number,
}

export type ADSREnvelope = {
    attack: number,
    decay: number,
    sustain: number,
    release: number,
}

export type SynthConfig = {
    waveForm: WaveForm,

    unisons: UnisonConfig[],

    volumeEnvelope: ADSREnvelope,

    filterEnvelope: ADSREnvelope,
}