import Synth from "./Synth";
import { SynthConfig, WaveForm } from "./Types";

type stateSetter<T> = (value: T) => void;

// think ahead children, don't do stuff like this fr
export default class ConfigLoader {
    private static instance: ConfigLoader;

    setWaveform: stateSetter<WaveForm> | undefined;
    setUnison0WaveForm: stateSetter<WaveForm> | undefined;
    setUnison1WaveForm: stateSetter<WaveForm> | undefined;

    setUnison0Detune: stateSetter<number> | undefined;
    setUnison1Detune: stateSetter<number> | undefined;

    setVolumeAttack: stateSetter<number> | undefined;
    setVolumeDecay: stateSetter<number> | undefined;
    setVolumeSustain: stateSetter<number> | undefined;
    setVolumeRelease: stateSetter<number> | undefined;

    setFilterAttack: stateSetter<number> | undefined;
    setFilterDecay: stateSetter<number> | undefined;
    setFilterSustain: stateSetter<number> | undefined;
    setFilterRelease: stateSetter<number> | undefined;

    setFilterFrequency: stateSetter<number> | undefined;
    setFilterResonance: stateSetter<number> | undefined;

    setEchoDelay: stateSetter<number> | undefined;
    setEchoFeedback: stateSetter<number> | undefined;

    static getConfigLoader(): ConfigLoader {
        if (!this.instance) this.instance = new ConfigLoader();
        return this.instance;
    }

    private constructor() {

    }

    load(config: SynthConfig): void {
        Synth.getSynth().setConfig(config);
        if (this.setWaveform) this.setWaveform(config.waveForm);

        if (this.setUnison0WaveForm) this.setUnison0WaveForm(config.unisons[0].waveForm);
        if (this.setUnison1WaveForm) this.setUnison1WaveForm(config.unisons[1].waveForm);

        if (this.setUnison0Detune) {
            console.log("setu0d", config.unisons[0].detune);
            
            this.setUnison0Detune(config.unisons[0].detune);
        }

        // not working
        if (this.setUnison1Detune) {
            console.log("setu1d", config.unisons[1].detune);
            
            this.setUnison1Detune(config.unisons[1].detune);
        }

        if (this.setVolumeAttack) this.setVolumeAttack(config.volumeEnvelope.attack);
        if (this.setVolumeDecay) this.setVolumeDecay(config.volumeEnvelope.decay);
        if (this.setVolumeSustain) this.setVolumeSustain(config.volumeEnvelope.sustain);
        if (this.setVolumeRelease) this.setVolumeRelease(config.volumeEnvelope.release);

        if (this.setFilterAttack) this.setFilterAttack(config.filterEnvelope.attack);
        if (this.setFilterDecay) this.setFilterDecay(config.filterEnvelope.decay);
        if (this.setFilterSustain) this.setFilterSustain(config.filterEnvelope.sustain);
        if (this.setFilterRelease) this.setFilterRelease(config.filterEnvelope.release);

        if (this.setFilterFrequency) this.setFilterFrequency(config.filter.frequency);
        if (this.setFilterResonance) this.setFilterResonance(config.filter.resonance);

        if (this.setEchoDelay) this.setEchoDelay(config.echo.delay);
        if (this.setEchoFeedback) this.setEchoFeedback(config.echo.feedback);
    }
}