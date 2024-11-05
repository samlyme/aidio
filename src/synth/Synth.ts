import { MAX_DELAY_TIME, MAX_STAGE_TIME } from "./Constants";
import { handleMIDIAccessFailure, handleMIDIAccessSuccess } from "./MidiUtils";
import { ADSREnvelope, FilterEnvelope, NoteChain, SynthConfig, UnisonConfig, MIDINote, MIDIVelocity, EchoNode, WaveForm, FilterConfig, EchoConfig } from "./Types";

export default class Synth {
    private audioContext: AudioContext;
    private echo: EchoNode;
    private limiter: DynamicsCompressorNode;
    private volume: GainNode;
    private config: SynthConfig;
    private activeNotes: Map<MIDINote, NoteChain> = new Map();

    private static instance: Synth;

    static getSynth(): Synth {
        if (!this.instance) this.instance = new Synth();
        return this.instance;
    }

    private constructor() {
        navigator.requestMIDIAccess().then(handleMIDIAccessSuccess, handleMIDIAccessFailure);

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
                { 
                    enabled: true,
                    waveForm: "sawtooth",
                    detune: 7,
                    gain: 0.8,
                }
            ],

            filter: {
                frequency: 5000,
                resonance: 10,
            },

            volumeEnvelope: {
                attack: 0.01 * MAX_STAGE_TIME,
                decay: 1 * MAX_STAGE_TIME,
                sustain: 0.5,
                release: 1 * MAX_STAGE_TIME,
            },

            filterEnvelope: {
                attack: 0.03 * MAX_STAGE_TIME,
                decay: 0.3 * MAX_STAGE_TIME,
                sustain: 0.5,
                release: 1 * MAX_STAGE_TIME,
                frequencyMin: 1000,
            },

            echo: {
                delay: 0.5,
                feedback: .1,
            }
        }

        this.volume = this.audioContext.createGain();
        this.echo = [this.audioContext.createDelay(), this.audioContext.createGain()];
        this.limiter = this.audioContext.createDynamicsCompressor();

        // master volume control
        this.volume.gain.value = 0.8;
        this.volume.connect(this.echo[0]);
        this.volume.connect(this.limiter);

        this.echo[0].delayTime.value = this.config.echo.delay;
        this.echo[0].connect(this.echo[1]);
        this.echo[1].gain.value = this.config.echo.feedback;
        this.echo[1].connect(this.echo[0]);
        this.echo[1].connect(this.limiter);

        // master limiter for the sake of the user
        this.limiter.threshold.value = -3; // Set threshold in dB
        this.limiter.ratio.value = 20; // Set compression ratio
        this.limiter.attack.value = 0.005; // Set attack time in seconds
        this.limiter.release.value = 0.05; // Set release time in seconds
        this.limiter.knee.value = 0; // Set knee in dB
        this.limiter.connect(this.audioContext.destination)
    }

    setVolume(value: number): void {
        if (value > 1 || value < 0) return;

        this.volume.gain.value = value;
    }

    setWaveform(value: WaveForm): void {
        this.config.waveForm = value;
    }

    setUnison(index: number, config: UnisonConfig): void {
        if (index < 0 || index > 1) throw new Error("invalid unison index");

        this.config.unisons[index] = {...config};
    }

    toggleUnison(index: number): void {
        if (index < 0 || index > 1) throw new Error("invalid unison index");

        if (this.config.unisons[index].enabled) {
            this.config.unisons[index].enabled = false;
        }
        else {
            this.config.unisons[index].enabled = true
        }
    }

    setUnisonWaveForm(index: number, waveForm: WaveForm): void {
        if (index < 0 || index > 1) throw new Error("invalid unison index");

        this.config.unisons[index].waveForm = waveForm;
    }

    setUnisonDetune(index: number, detune: number): void {
        if (index < 0 || index > 1) throw new Error("invalid unison index");

        this.config.unisons[index].detune = detune;
    }

    setUnisonGain(index: number, gain: number): void {
        if (index < 0 || index > 1) throw new Error("invalid unison index");

        this.config.unisons[index].gain = gain;
    }

    setFilter(config: FilterConfig): void {
        this.config.filter = {...config};
    }

    setFilterFrequency(frequency: number) {
        this.config.filter.frequency = frequency;
    }

    setFilterResonance(resonance: number) {
        this.config.filter.resonance = resonance;
    }

    setVolumeEnvelope(config: ADSREnvelope) {
        if (
            config.attack > MAX_STAGE_TIME || config.attack < 0 ||
            config.decay > MAX_STAGE_TIME || config.decay < 0 ||
            config.release > MAX_STAGE_TIME || config.release < 0
        ) throw new Error("Invalid times");

        if (config.sustain < 0 || config.sustain > 1)
            throw new Error("Invalid sustain")

        this.config.volumeEnvelope = {...config};
    }

    setVolumeAttack(attack: number) {
        if (attack > MAX_STAGE_TIME || attack < 0) 
            throw new Error("Invalid attack time");

        this.config.volumeEnvelope.attack = attack;
    }

    setVolumeDecay(decay: number) {
        if (decay > MAX_STAGE_TIME || decay < 0)
            throw new Error("Invalid decay time");

        this.config.volumeEnvelope.decay = decay;
    }

    setVolumeSustain(sustain: number) {
        if (sustain < 0 || sustain > 1) 
            throw new Error("Invalid sustain value");

        this.config.volumeEnvelope.sustain = sustain;
    }
    
    setVolumeRelease(release: number) {
        if (release > MAX_STAGE_TIME || release < 0)
            throw new Error("Invalid release time");

        this.config.volumeEnvelope.release = release;
    }

    setFilterEnvelop(config: FilterEnvelope) {
        if (
            config.attack > MAX_STAGE_TIME || config.attack < 0 ||
            config.decay > MAX_STAGE_TIME || config.decay < 0 ||
            config.release > MAX_STAGE_TIME || config.release < 0
        ) throw new Error("Invalid times");

        if (config.sustain < 0 || config.sustain > 1)
            throw new Error("Invalid sustain")

        this.config.filterEnvelope = {...config};
    }

    setFilterAttack(attack: number) {
        if (attack > MAX_STAGE_TIME || attack < 0) 
            throw new Error("Invalid attack time");

        this.config.filterEnvelope.attack = attack;
    }

    setFilterDecay(decay: number) {
        if (decay > MAX_STAGE_TIME || decay < 0)
            throw new Error("Invalid decay time");

        this.config.filterEnvelope.decay = decay;
    }

    setFilterSustain(sustain: number) {
        if (sustain < 0 || sustain > 1) 
            throw new Error("Invalid sustain value");

        this.config.filterEnvelope.sustain = sustain;
    }
    
    setFilterRelease(release: number) {
        if (release > MAX_STAGE_TIME || release < 0)
            throw new Error("Invalid release time");

        this.config.filterEnvelope.release = release;
    }

    setEcho(config: EchoConfig) {
        this.config.echo = {...config};
    }

    setEchoDelay(delay: number) {
        if (delay < 0 || delay > MAX_DELAY_TIME)
            throw new Error("Invalid delay time");

        this.config.echo.delay = delay;
    }

    setEchoFeedback(feedback: number) {
        if(feedback < 0 || feedback > 1)
            throw new Error("Invalid feedback value");
            
        this.config.echo.feedback = feedback;
    }

    getAudioContext(): AudioContext {
        return this.audioContext;
    }
    
    getConfig(): SynthConfig {
        return {...this.config};
    }

    playNote(note: MIDINote, velocity: MIDIVelocity) {
        const chain: NoteChain = this.generateNoteChain(note, velocity);

        chain[0].forEach((voice: OscillatorNode) => voice.start());

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

    private generateFilterWithADSR(): BiquadFilterNode {
        const filter: BiquadFilterNode = this.audioContext.createBiquadFilter();

        filter.type = "lowpass";
        filter.Q.value = this.config.filter.resonance;

        const now: number = this.audioContext.currentTime;
        const attackEndTime: number = now + this.config.filterEnvelope.attack;
        const decayDuration: number = this.config.filterEnvelope.decay;
        const sustain: number = this.config.filterEnvelope.sustain;
        const frequencyMin = this.config.filterEnvelope.frequencyMin;
        const frequency = this.config.filter.frequency;
        filter.frequency.setValueAtTime(frequencyMin, now);
        filter.frequency.linearRampToValueAtTime(frequency, attackEndTime);
        filter.frequency.setTargetAtTime(frequency * sustain, attackEndTime, decayDuration);

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

    private midiNoteToFrequency(midiNote: MIDINote) {
        return (440 / 32) * (2 ** ((midiNote - 9) / 12));
    }

    private midiVelocityToGain(midiVelocity: MIDIVelocity) {
        return midiVelocity / 127.0;
    }
}