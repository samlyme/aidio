import { MAX_STAGE_TIME } from "./Constants";
import { ADSREnvelope, FilterEnvelope, NoteChain, SynthConfig, UnisonConfig, MIDINote, MIDIVelocity } from "./Types";

// TODO: refactor this to singleton
//  classes typically dont contain mutable state
// this is a really non-standard and plain weird design pattern
export default class Synth {
    private audioContext: AudioContext;
    // TODO: implement echo effect
    // TODO: implement "chaining function"
    private limiter: DynamicsCompressorNode;
    private volume: GainNode;
    private config: SynthConfig;
    private activeNotes: Map<MIDINote, NoteChain> = new Map();

    constructor() {
        navigator.requestMIDIAccess().then(this.handleMIDIAccessSuccess, this.handleMIDIAccessFailure);
        this.audioContext = new AudioContext();

        this.config = {
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
        this.volume = this.audioContext.createGain();
        this.limiter = this.audioContext.createDynamicsCompressor();

        // master volume control
        this.volume.gain.value = 0.8;
        this.volume.connect(this.limiter);

        // master limiter for the sake of the user
        this.limiter.threshold.value = -3; // Set threshold in dB
        this.limiter.ratio.value = 20; // Set compression ratio
        this.limiter.attack.value = 0.005; // Set attack time in seconds
        this.limiter.release.value = 0.05; // Set release time in seconds
        this.limiter.knee.value = 0; // Set knee in dB
        this.limiter.connect(this.audioContext.destination)
    }

     setVolume(value: number) {
        if (value > 1 || value < 0) return;

        this.volume.gain.value = value;
    }

     setUnison(index: number, config: UnisonConfig) {
        if (index < 0 || index > 1) throw new Error("invalid unison index");

        this.config.unisons[index] = config;
    }

     setVolumeEnvelope(config: ADSREnvelope) {
        if (
            config.attack > MAX_STAGE_TIME || config.attack < 0 ||
            config.decay > MAX_STAGE_TIME || config.decay < 0 ||
            config.release > MAX_STAGE_TIME || config.release < 0
        ) throw new Error("Invalid times");

        if (config.sustain < 0 || config.sustain > 1)
            throw new Error("Invalid sustain")

        this.config.volumeEnvelope = config;
    }

     setFilterEnvelop(config: FilterEnvelope) {
        if (
            config.attack > MAX_STAGE_TIME || config.attack < 0 ||
            config.decay > MAX_STAGE_TIME || config.decay < 0 ||
            config.release > MAX_STAGE_TIME || config.release < 0
        ) throw new Error("Invalid times");

        if (config.sustain < 0 || config.sustain > 1)
            throw new Error("Invalid sustain")

        this.config.filterEnvelope = config;
    }

    // TODO: refactor code to extract each node into a generator
     playNote(note: MIDINote, velocity: MIDIVelocity) {
        const chain: NoteChain = this.generateNoteChain(note, velocity);

        chain[0].forEach((unison: OscillatorNode) => unison.start());

        this.activeNotes.set(note, chain);
    }

     releaseNote(note: MIDINote) {
        const activeNote: NoteChain | undefined = this.activeNotes.get(note);

        if (activeNote) {
            this.activeNotes.delete(note);

            // Atrociously unsafe
            // TODO: implement a safe way to do release effects
            this.releaseADSRGain(activeNote[1][1] as GainNode);
            this.releaseFilter(activeNote[1][2] as BiquadFilterNode);

            setTimeout(() => {
                this.killNoteChain(activeNote);
            }, 1000 * this.config.volumeEnvelope.release);
        }
    }

    private generateNoteChain(note: MIDINote, velocity: MIDIVelocity): NoteChain {
        const oscillator: OscillatorNode = this.generateOscillator(note);
        const unisons: OscillatorNode[] = this.generateUnisons(note);
        const velocityGain: GainNode = this.generateVelocityGain(velocity);
        const adsrGain: GainNode = this.generateVolumeADSR();
        const filter: BiquadFilterNode = this.generateFilterWithADSR();

        oscillator.connect(velocityGain);
        unisons.forEach((value: OscillatorNode) => value.connect(velocityGain));
        velocityGain.connect(adsrGain);
        adsrGain.connect(filter);
        filter.connect(this.volume);

        return [[oscillator, ...unisons], [velocityGain, adsrGain, filter]];
    }

    private generateOscillator(note: MIDINote): OscillatorNode {
        const oscillator: OscillatorNode = this.audioContext.createOscillator();

        oscillator.type = this.config.waveForm;
        oscillator.frequency.value = this.midiNoteToFrequency(note);

        return oscillator;
    }

    private generateUnisons(note: MIDINote): OscillatorNode[] {
        const unisons: OscillatorNode[] = [];

        this.config.unisons.forEach((value: UnisonConfig) => {
            if (value.enabled) {
                const unisonHi: OscillatorNode = this.audioContext.createOscillator();
                const unisonLo: OscillatorNode = this.audioContext.createOscillator();

                unisonHi.type = value.waveForm;
                unisonLo.type = value.waveForm;

                unisonHi.frequency.value = this.midiNoteToFrequency(note);
                unisonLo.frequency.value = this.midiNoteToFrequency(note);

                unisonHi.detune.value = value.detune;
                unisonLo.detune.value = -value.detune;

                unisons.push(unisonHi);
                unisons.push(unisonLo);
            }
        })

        return unisons;
    }

    private generateVelocityGain(velocity: MIDIVelocity): GainNode {
        const velocityGain = this.audioContext.createGain();

        velocityGain.gain.value = this.midiVelocityToGain(velocity);

        return velocityGain;
    }

    private generateVolumeADSR(): GainNode {
        const adsrGain: GainNode = this.audioContext.createGain();

        const now: number = this.audioContext.currentTime;
        const attackEndTime: number = now + this.config.volumeEnvelope.attack;
        const decayDuration: number = this.config.volumeEnvelope.decay;
        adsrGain.gain.setValueAtTime(0, now);
        adsrGain.gain.linearRampToValueAtTime(1, attackEndTime);
        adsrGain.gain.setTargetAtTime(this.config.volumeEnvelope.sustain,
            attackEndTime, decayDuration);

        return adsrGain;
    }

    // TODO: Implement filter adsr
    private generateFilterWithADSR(): BiquadFilterNode {
        const filter: BiquadFilterNode = this.audioContext.createBiquadFilter();

        filter.type = "lowpass";
        filter.Q.value = this.config.filter.resonance;

        const now: number = this.audioContext.currentTime;
        const attackEndTime: number = now + this.config.filterEnvelope.attack;
        const decayDuration: number = this.config.filterEnvelope.decay;
        const frequencyMin = this.config.filterEnvelope.frequencyMin;
        const frequencyMax = this.config.filterEnvelope.frequencyMax;
        const frequency = this.config.filter.frequency;
        filter.frequency.setValueAtTime(frequencyMin, now);
        filter.frequency.linearRampToValueAtTime(frequencyMax, attackEndTime);
        filter.frequency.setTargetAtTime(frequency, attackEndTime, decayDuration);

        return filter;
    }

    private releaseADSRGain(adsrGain: GainNode) {
        const now: number = this.audioContext.currentTime;
        const releaseDuration: number = this.config.volumeEnvelope.release;
        const releaseEndTime: number = now + releaseDuration;

        adsrGain.gain.cancelScheduledValues(now);
        adsrGain.gain.setValueAtTime(adsrGain.gain.value, now);
        adsrGain.gain.exponentialRampToValueAtTime(0.001, releaseEndTime);
    }

    private releaseFilter(filter: BiquadFilterNode) {
        const now: number = this.audioContext.currentTime;
        const releaseDuration: number = this.config.volumeEnvelope.release;
        const releaseEndTime: number = now + releaseDuration;

        const frequencyMin = this.config.filterEnvelope.frequencyMin;
        filter.frequency.cancelScheduledValues(now);
        filter.frequency.setValueAtTime(filter.frequency.value, now);
        filter.frequency.exponentialRampToValueAtTime(frequencyMin, releaseEndTime);
    }

    private killNoteChain(noteChain: NoteChain) {
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

     getAudioContext(): AudioContext {
        return this.audioContext;
    }

    private handleMIDIAccessSuccess(midiAccess: MIDIAccess) {
        midiAccess.addEventListener("statechange", this.updateDevices);

        // this should only be one midi input, but i am running a foreach
        // just in case the end user uses multiple midi devices.
        const inputs: MIDIInputMap = midiAccess.inputs;

        inputs.forEach((input: MIDIInput) => {
            // input.onmidimessage = handleInput;
            input.addEventListener("midimessage", this.handleInput);
        })
    }

    private handleMIDIAccessFailure(): void {
    }

    // dont ask why this event can't be typed
    private updateDevices(event: Event): void {
        console.log("new device", event);
    }

    private handleInput(event: MIDIMessageEvent): void {
        if (event.data) {
            const [command, note, velocity] = event.data;

            if (command == 254 || command == 248) return;

            if (command == 144 && velocity > 0) {
                this.playNote(note, velocity);
            }
            else {
                this.releaseNote(note);
            }
        }
    }

    private midiNoteToFrequency(midiNote: MIDINote) {
        return (440 / 32) * (2 ** ((midiNote - 9) / 12));
    }

    private midiVelocityToGain(midiVelocity: MIDIVelocity) {
        return midiVelocity / 127.0;
    }
}