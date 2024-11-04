import { ADSREnvelope, SynthConfig, UnisonConfig } from "./Types";

const STAGE_MAX_TIME = 2;

export default class Synth {
    private static audioContext: AudioContext;
    private static limiter: DynamicsCompressorNode;
    private static volume: GainNode;
    private static config: SynthConfig;
    private static activeNotes: Map<number, [OscillatorNode, GainNode]> = new Map();

    constructor() {
        navigator.requestMIDIAccess().then(Synth.handleMIDIAccessSuccess, Synth.handleMIDIAccessFailure);
        Synth.audioContext = new AudioContext();

        // master limiter for the sake of the user
        Synth.limiter = Synth.audioContext.createDynamicsCompressor();
        Synth.limiter.threshold.value = -13; // Set threshold in dB
        Synth.limiter.ratio.value = 20; // Set compression ratio
        Synth.limiter.attack.value = 0.005; // Set attack time in seconds
        Synth.limiter.release.value = 0.05; // Set release time in seconds
        Synth.limiter.knee.value = 0; // Set knee in dB
        Synth.limiter.connect(Synth.audioContext.destination)

        // master volume control
        Synth.volume = Synth.audioContext.createGain();
        // let the user adjust later
        Synth.volume.gain.value = 0.8;

        Synth.config = {
            waveForm: "square",
            unisons: [{ enabled: false }, { enabled: false }], // by default have 2 disabled
            volumeEnvelope: {
                attack: 0.01,
                decay: 0,
                sustain: 1,
                release: 0.03,
            },
            filterEnvelope: {
                attack: 0,
                decay: 0,
                sustain: 0,
                release: 0,
            }
        }
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
        if (config.attack > STAGE_MAX_TIME
            || config.decay > STAGE_MAX_TIME
            || config.release > STAGE_MAX_TIME
        ) throw new Error("Time too long");

        if (config.sustain > 1 || config.sustain < 0) 
            throw new Error("Invalid sustain")

        Synth.config.volumeEnvelope = config;
    }

    static setFilterEnvelop(config: ADSREnvelope) {
        if (config.attack > STAGE_MAX_TIME
            || config.decay > STAGE_MAX_TIME
            || config.release > STAGE_MAX_TIME
        ) throw new Error("Time too long");

        if (config.sustain > 1 || config.sustain < 0) 
            throw new Error("Invalid sustain")

        Synth.config.filterEnvelope = config;
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

    private static midiNoteToFrequency(midiNote: number) {
        return (440 / 32) * (2 ** ((midiNote - 9) / 12));
    }

    private static midiVelocityToGain(midiVelocity: number) {
        return midiVelocity / 127.0;
    }

    static playNote(note: number, velocity: number) {
        const oscillator: OscillatorNode = Synth.audioContext.createOscillator();
        const velocityGain: GainNode = Synth.audioContext.createGain();

        oscillator.type = this.config.waveForm;
        oscillator.frequency.value = Synth.midiNoteToFrequency(note);
        oscillator.connect(velocityGain);

        velocityGain.gain.value = Synth.midiVelocityToGain(velocity);
        velocityGain.connect(Synth.audioContext.destination);

        oscillator.start();
        Synth.activeNotes.set(note, [oscillator, velocityGain]);
    }

    static releaseNote(note: number) {
        const activeNote: [OscillatorNode, GainNode] | undefined = Synth.activeNotes.get(note);

        if (activeNote) {
            activeNote[0].stop();
            activeNote[0].disconnect();
            activeNote[1].disconnect();
            Synth.activeNotes.delete(note);
        }
    }
}