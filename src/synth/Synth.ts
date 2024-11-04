import { ADSREnvelope, NoteChain, SynthConfig, UnisonConfig } from "./Types";

const STAGE_MAX_TIME = 2;

export default class Synth {
    private static audioContext: AudioContext;
    private static limiter: DynamicsCompressorNode;
    private static volume: GainNode;
    private static config: SynthConfig;
    private static activeNotes: Map<number, NoteChain> = new Map();

    constructor() {
        navigator.requestMIDIAccess().then(Synth.handleMIDIAccessSuccess, Synth.handleMIDIAccessFailure);
        Synth.audioContext = new AudioContext();

        Synth.config = {
            waveForm: "triangle",
            unisons: [
                { 
                    enabled: true,
                    waveForm: "triangle",
                    detune: 4,
                    gain: 0.8,
                }, 
                { enabled: false }
            ], // by default have 2 disabled

            volumeEnvelope: {
                attack: 1,
                decay: 1,
                sustain: 0.5,
                release: 1,
            },
            filterEnvelope: {
                attack: 0,
                decay: 0,
                sustain: 0,
                release: 0,
            }
        }

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
        Object.values(config).forEach(
            (value: number) => {
                if (value < 0 || value > 1) 
                    throw new Error("Invalid ADSR config");
            }
        )

        Synth.config.volumeEnvelope = config;
    }

    static setFilterEnvelop(config: ADSREnvelope) {
        Object.values(config).forEach(
            (value: number) => {
                if (value < 0 || value > 1) 
                    throw new Error("Invalid ADSR config");
            }
        )

        Synth.config.filterEnvelope = config;
    }

    static playNote(note: number, velocity: number) {
        const oscillator: OscillatorNode = Synth.audioContext.createOscillator();
        const unisons: OscillatorNode[] = [];
        const velocityGain: GainNode = Synth.audioContext.createGain();
        const adsrGain: GainNode = Synth.audioContext.createGain();
        const filter: BiquadFilterNode = Synth.audioContext.createBiquadFilter();

        oscillator.type = this.config.waveForm;
        oscillator.frequency.value = Synth.midiNoteToFrequency(note);
        oscillator.connect(velocityGain);

        Synth.config.unisons.forEach((value: UnisonConfig) => {
            if (value.enabled) {
                const unisonHi: OscillatorNode = Synth.audioContext.createOscillator();
                const unisonLo: OscillatorNode = Synth.audioContext.createOscillator();
                unisonHi.type = value.waveForm;
                unisonLo.type = value.waveForm;

                unisonHi.detune.value = value.detune;
                unisonLo.detune.value = -value.detune;

                unisonHi.connect(velocityGain);
                unisonLo.connect(velocityGain);

                unisons.push(unisonHi);
                unisons.push(unisonLo);
            }
        })

        velocityGain.gain.value = Synth.midiVelocityToGain(velocity);
        velocityGain.connect(adsrGain);

        const now: number = Synth.audioContext.currentTime;
        const attackEndTime: number = now + Synth.config.volumeEnvelope.attack * STAGE_MAX_TIME;
        const decayDuration: number = Synth.config.volumeEnvelope.decay * STAGE_MAX_TIME;
        adsrGain.gain.setValueAtTime(0, now);
        adsrGain.gain.linearRampToValueAtTime(1, attackEndTime);
        adsrGain.gain.setTargetAtTime(Synth.config.volumeEnvelope.sustain, 
            attackEndTime, decayDuration);
        adsrGain.connect(filter);

        filter.type = "lowpass";
        filter.frequency.value = 5000; // TODO: change filter freq
        filter.Q.value = 30;
        filter.connect(Synth.volume);

        oscillator.start();
        unisons.forEach((unison: OscillatorNode) => unison.start());
        
        Synth.activeNotes.set(note, [[oscillator, ...unisons], velocityGain, adsrGain, filter]);
    }

    static releaseNote(note: number) {
        const activeNote: NoteChain | undefined = Synth.activeNotes.get(note);

        if (activeNote) {
            const oscillators: OscillatorNode[] = activeNote[0];
            const velocityGain: GainNode = activeNote[1]; 
            const adsrGain: GainNode = activeNote[2];
            const filter: BiquadFilterNode = activeNote[3];
            Synth.activeNotes.delete(note);

            const now: number = Synth.audioContext.currentTime;
            const releaseDuration: number = Synth.config.volumeEnvelope.release * STAGE_MAX_TIME;
            const releaseEndTime: number = now + releaseDuration;

            adsrGain.gain.cancelScheduledValues(now);
            adsrGain.gain.setValueAtTime(adsrGain.gain.value, now);
            adsrGain.gain.exponentialRampToValueAtTime(0.001, releaseEndTime);

            setTimeout(() => {
                oscillators.forEach((oscillator: OscillatorNode) => {
                    oscillator.stop();
                    oscillator.disconnect();
                })
                velocityGain.disconnect();
                adsrGain.disconnect();
                filter.disconnect();
            }, 1000 * releaseDuration);
        }
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
}