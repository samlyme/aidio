type WaveForm = "sine" | "square" | "triangle" | "sawtooth";

type SynthConfig = {
    waveForm: WaveForm;
}

export default class Synth {
    private static audioContext: AudioContext;
    private static config: SynthConfig;
    private static activeNotes: Map<number, [OscillatorNode, GainNode]> = new Map();

    constructor() {
        navigator.requestMIDIAccess().then(Synth.handleMIDIAccessSuccess, Synth.handleMIDIAccessFailure);
        Synth.audioContext = new AudioContext();

        console.log(Synth.config);
        
        Synth.config = {
            waveForm: "sine",
        }
    }

    private static handleMIDIAccessSuccess(midiAccess: MIDIAccess) {
        midiAccess.addEventListener("statechange", Synth.updateDevices);

        // this should only be one midi input, but i am running a foreach
        // just in case the end user uses multiple midi devices.
        const inputs: MIDIInputMap = midiAccess.inputs;
        console.log(inputs)

        inputs.forEach((input: MIDIInput) => {
            // input.onmidimessage = handleInput;
            input.addEventListener("midimessage", Synth.handleInput);
        })
    }

    private static handleMIDIAccessFailure(): void {
        console.log("Could not access midi");
    }

    // dont ask why this event can't be typed
    private static updateDevices(event: Event): void {
        console.log(event);
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

    private static playNote(note: number, velocity: number) {
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

    private static releaseNote(note: number) {
        const activeNote: [OscillatorNode, GainNode] | undefined = Synth.activeNotes.get(note);

        if (activeNote) {
            activeNote[0].stop();
            activeNote[0].disconnect();
            activeNote[1].disconnect();
            Synth.activeNotes.delete(note);
        }
    }
}