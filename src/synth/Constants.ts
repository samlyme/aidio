import { UnisonConfig } from "./Types"

export const MAX_STAGE_TIME: number = 2;

export const MAX_DELAY_TIME: number = 2;

export const defaultUnisonConfig: UnisonConfig = {
    enabled: true,
    waveForm: "sine",
    detune: 0,
    gain: 1,
}