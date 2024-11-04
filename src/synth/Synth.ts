import { MAX_STAGE_TIME } from "./Constants";
import { ADSREnvelope, FilterEnvelope, NoteChain, SynthConfig, UnisonConfig, MIDINote, MIDIVelocity } from "./Types";

// TODO: refactor this to singleton
// static classes typically dont contain mutable state
// this is a really non-standard and plain weird design pattern
export default class Synth {
    private static audioContext: AudioContext;
    // TODO: implement echo effect
    // TODO: implement "chaining function"
    private static limiter: DynamicsCompressorNode;
    private static volume: GainNode;
    private static config: SynthConfig;
    private static activeNotes: Map<MIDINote, NoteChain> = new Map();

    constructor() {
        navigator.requestMIDIAccess().then(Synth.handleMIDIAccessSuccess, Synth.handleMIDIAccessFailure);
        Synth.audioContext = new AudioContext();

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

        // TODO: implement effects class, use builder pattern with chain
        // - Generator function that takes in an array and returns a chain
        // - Note source that connects to the effects chain 
        Synth.volume = Synth.audioContext.createGain();
        Synth.limiter = Synth.audioContext.createDynamicsCompressor();

        // master volume control
        Synth.volume.gain.value = 0.8;
        Synth.volume.connect(Synth.limiter);

        // master limiter for the sake of the user
        Synth.limiter.threshold.value = -3; // Set threshold in dB
        Synth.limiter.ratio.value = 20; // Set compression ratio
        Synth.limiter.attack.value = 0.005; // Set attack time in seconds
        Synth.limiter.release.value = 0.05; // Set release time in seconds
        Synth.limiter.knee.value = 0; // Set knee in dB
        Synth.limiter.connect(Synth.audioContext.destination)
    }

    static setVolume(value: number) {
        if (value > 1 || value < 0) return;

        Synth.volume.gain.value = value;
    }

    static setUnison(index: number, config: UnisonConfig) {
        if (index < 0 || index > 1) throw new Error("invalid unison index");

        Synth.config.unisons[index] = config;
    }

    static setVolumeEnvelope(config: ADSREnvelope) {
        if (
            config.attack > MAX_STAGE_TIME || config.attack < 0 ||
            config.decay > MAX_STAGE_TIME || config.decay < 0 ||
            config.release > MAX_STAGE_TIME || config.release < 0
        ) throw new Error("Invalid times");

        if (config.sustain < 0 || config.sustain > 1)
            throw new Error("Invalid sustain")

        Synth.config.volumeEnvelope = config;
    }

    static setFilterEnvelop(config: FilterEnvelope) {
        if (
            config.attack > MAX_STAGE_TIME || config.attack < 0 ||
            config.decay > MAX_STAGE_TIME || config.decay < 0 ||
            config.release > MAX_STAGE_TIME || config.release < 0
        ) throw new Error("Invalid times");

        if (config.sustain < 0 || config.sustain > 1)
            throw new Error("Invalid sustain")

        Synth.config.filterEnvelope = config;
    }

    // TODO: refactor code to extract each node into a generator
    static playNote(note: MIDINote, velocity: MIDIVelocity) {
        const chain: NoteChain = Synth.generateNoteChain(note, velocity);

        chain[0].forEach((unison: OscillatorNode) => unison.start());

        Synth.activeNotes.set(note, chain);
    }

    static releaseNote(note: MIDINote) {
        const activeNote: NoteChain | undefined = Synth.activeNotes.get(note);

        if (activeNote) {
            Synth.activeNotes.delete(note);

            // Atrociously unsafe
            // TODO: implement a safe way to do release effects
            Synth.releaseADSRGain(activeNote[1][1] as GainNode);
            Synth.releaseFilter(activeNote[1][2] as BiquadFilterNode);

            setTimeout(() => {
                Synth.killNoteChain(activeNote);
            }, 1000 * Synth.config.volumeEnvelope.release);
        }
    }

    private static generateNoteChain(note: MIDINote, velocity: MIDIVelocity): NoteChain {
        const oscillator: OscillatorNode = Synth.generateOscillator(note);
        const unisons: OscillatorNode[] = Synth.generateUnisons(note);
        const velocityGain: GainNode = Synth.generateVelocityGain(velocity);
        const adsrGain: GainNode = Synth.generateVolumeADSR();
        const filter: BiquadFilterNode = Synth.generateFilterWithADSR();

        oscillator.connect(velocityGain);
        unisons.forEach((value: OscillatorNode) => value.connect(velocityGain));
        velocityGain.connect(adsrGain);
        adsrGain.connect(filter);
        filter.connect(Synth.volume);

        return [[oscillator, ...unisons], [velocityGain, adsrGain, filter]];
    }

    private static generateOscillator(note: MIDINote): OscillatorNode {
        const oscillator: OscillatorNode = Synth.audioContext.createOscillator();

        oscillator.type = this.config.waveForm;
        oscillator.frequency.value = Synth.midiNoteToFrequency(note);

        return oscillator;
    }

    private static generateUnisons(note: MIDINote): OscillatorNode[] {
        const unisons: OscillatorNode[] = [];

        Synth.config.unisons.forEach((value: UnisonConfig) => {
            if (value.enabled) {
                const unisonHi: OscillatorNode = Synth.audioContext.createOscillator();
                const unisonLo: OscillatorNode = Synth.audioContext.createOscillator();

                unisonHi.type = value.waveForm;
                unisonLo.type = value.waveForm;

                unisonHi.frequency.value = Synth.midiNoteToFrequency(note);
                unisonLo.frequency.value = Synth.midiNoteToFrequency(note);

                unisonHi.detune.value = value.detune;
                unisonLo.detune.value = -value.detune;

                unisons.push(unisonHi);
                unisons.push(unisonLo);
            }
        })

        return unisons;
    }

    private static generateVelocityGain(velocity: MIDIVelocity): GainNode {
        const velocityGain = Synth.audioContext.createGain();

        velocityGain.gain.value = Synth.midiVelocityToGain(velocity);

        return velocityGain;
    }

    private static generateVolumeADSR(): GainNode {
        const adsrGain: GainNode = Synth.audioContext.createGain();

        const now: number = Synth.audioContext.currentTime;
        const attackEndTime: number = now + Synth.config.volumeEnvelope.attack;
        const decayDuration: number = Synth.config.volumeEnvelope.decay;
        adsrGain.gain.setValueAtTime(0, now);
        adsrGain.gain.linearRampToValueAtTime(1, attackEndTime);
        adsrGain.gain.setTargetAtTime(Synth.config.volumeEnvelope.sustain,
            attackEndTime, decayDuration);

        return adsrGain;
    }

    // TODO: Implement filter adsr
    private static generateFilterWithADSR(): BiquadFilterNode {
        const filter: BiquadFilterNode = Synth.audioContext.createBiquadFilter();

        filter.type = "lowpass";
        filter.Q.value = Synth.config.filter.resonance;

        const now: number = Synth.audioContext.currentTime;
        const attackEndTime: number = now + Synth.config.filterEnvelope.attack;
        const decayDuration: number = Synth.config.filterEnvelope.decay;
        const frequencyMin = Synth.config.filterEnvelope.frequencyMin;
        const frequencyMax = Synth.config.filterEnvelope.frequencyMax;
        const frequency = Synth.config.filter.frequency;
        filter.frequency.setValueAtTime(frequencyMin, now);
        filter.frequency.linearRampToValueAtTime(frequencyMax, attackEndTime);
        filter.frequency.setTargetAtTime(frequency, attackEndTime, decayDuration);

        return filter;
    }

    private static releaseADSRGain(adsrGain: GainNode) {
        const now: number = Synth.audioContext.currentTime;
        const releaseDuration: number = Synth.config.volumeEnvelope.release;
        const releaseEndTime: number = now + releaseDuration;

        adsrGain.gain.cancelScheduledValues(now);
        adsrGain.gain.setValueAtTime(adsrGain.gain.value, now);
        adsrGain.gain.exponentialRampToValueAtTime(0.001, releaseEndTime);
    }

    private static releaseFilter(filter: BiquadFilterNode) {
        const now: number = Synth.audioContext.currentTime;
        const releaseDuration: number = Synth.config.volumeEnvelope.release;
        const releaseEndTime: number = now + releaseDuration;

        const frequencyMin = Synth.config.filterEnvelope.frequencyMin;
        filter.frequency.cancelScheduledValues(now);
        filter.frequency.setValueAtTime(filter.frequency.value, now);
        filter.frequency.exponentialRampToValueAtTime(frequencyMin, releaseEndTime);
    }

    private static killNoteChain(noteChain: NoteChain) {
        const oscillators: OscillatorNode[] = noteChain[0];
        const effects: AudioNode[] = noteChain[1];

        oscillators.forEach((oscillator: OscillatorNode) => {
            oscillator.stop();
            oscillator.disconnect();
        })
        effects.forEach((effect: AudioNode) => {
            effect.disconnect();
        })
    }

    static getAudioContext(): AudioContext {
        return Synth.audioContext;
    }

    private static handleMIDIAccessSuccess(midiAccess: MIDIAccess) {
        midiAccess.addEventListener("statechange", Synth.updateDevices);

        // this should only be one midi input, but i am running a foreach
        // just in case the end user uses multiple midi devices.
        const inputs: MIDIInputMap = midiAccess.inputs;

        inputs.forEach((input: MIDIInput) => {
            // input.onmidimessage = handleInput;
            input.addEventListener("midimessage", Synth.handleInput);
        })
    }

    private static handleMIDIAccessFailure(): void {
    }

    // dont ask why this event can't be typed
    private static updateDevices(event: Event): void {
        console.log("new device", event);
    }

    private static handleInput(event: MIDIMessageEvent): void {
        if (event.data) {
            const [command, note, velocity] = event.data;

            if (command == 254 || command == 248) return;

            if (command == 144 && velocity > 0) {
                Synth.playNote(note, velocity);
            }
            else {
                Synth.releaseNote(note);
            }
        }
    }

    private static midiNoteToFrequency(midiNote: MIDINote) {
        return (440 / 32) * (2 ** ((midiNote - 9) / 12));
    }

    private static midiVelocityToGain(midiVelocity: MIDIVelocity) {
        return midiVelocity / 127.0;
    }
}