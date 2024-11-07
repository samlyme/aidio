import { WaveForm } from "./Types";

type stateSetter<T> = (value: T) => void;

export default class ConfigLoader {
    private static instance: ConfigLoader;

    setWaveform: stateSetter<WaveForm> | undefined;
    setUnison0WaveForm: stateSetter<WaveForm> | undefined;
    setUnison1WaveForm: stateSetter<WaveForm> | undefined;

    setUnison0Detune: stateSetter<number> | undefined;
    setUnison1Detune: stateSetter<number> | undefined;


    setFilterAttack: stateSetter<number> | undefined;
    setFilterDecay: stateSetter<number> | undefined;
    setFilterSustain: stateSetter<number> | undefined;
    setFilterRelease: stateSetter<number> | undefined;

    setVolumeAttack: stateSetter<number> | undefined;
    setVolumeDecay: stateSetter<number> | undefined;
    setVolumeSustain: stateSetter<number> | undefined;
    setVolumeRelease: stateSetter<number> | undefined;

    static getConfigLoader(): ConfigLoader {
        if (!this.instance) this.instance = new ConfigLoader();
        return this.instance;
    }

    private constructor() {

    }
}