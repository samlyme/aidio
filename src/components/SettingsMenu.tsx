import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import ToggleButton from "@mui/material/ToggleButton"
import CustomSlider from "./Slider"
import { useEffect, useState } from "react"
import { SynthConfig, WaveForm } from "../synth/Types"
import Synth from "../synth/Synth"
import Oscilloscope from "./Oscilloscope"
import { DEFAULT_DETUNE, DEFAULT_ECHO_DELAY, DEFAULT_ECHO_FEEDBACK, DEFAULT_FILTER_ATTACK, DEFAULT_FILTER_DECAY, DEFAULT_FILTER_FREQUENCY, DEFAULT_FILTER_RELEASE, DEFAULT_FILTER_RESONANCE, DEFAULT_FILTER_SUSTAIN, DEFAULT_MASTER_VOLUME, DEFAULT_VOLUME_ATTACK, DEFAULT_VOLUME_DECAY, DEFAULT_VOLUME_RELEASE, DEFAULT_VOLUME_SUSTAIN, MAX_DETUNE, MAX_FILTER_ATTACK, MAX_FILTER_DECAY, MAX_FILTER_FREQUENCY, MAX_FILTER_RELEASE, MAX_FILTER_RESONANCE, MAX_FILTER_SUSTAIN, MAX_MASTER_VOLUME, MAX_VOLUME_ATTACK, MAX_VOLUME_DECAY, MAX_VOLUME_RELEASE, MAX_VOLUME_SUSTAIN, MIN_DETUNE, MIN_FILTER_ATTACK, MIN_FILTER_DECAY, MIN_FILTER_FREQUENCY, MIN_FILTER_RELEASE, MIN_FILTER_RESONANCE, MIN_FILTER_SUSTAIN, MIN_MASTER_VOLUME, MIN_VOLUME_ATTACK, MIN_VOLUME_DECAY, MIN_VOLUME_RELEASE, MIN_VOLUME_SUSTAIN } from "../synth/Constants"
import ConfigLoader from "../synth/ConfigLoader"
import { prompt } from "../services/Gemini"

const configLoader = ConfigLoader.getConfigLoader();

export default function SettingsMenu({ setFocus }) {

    return (
        <>
            <div className=" flex gap-5 mt-5 mr-5 pb-10">
                <VoicesMenu />

                <EnvelopesMenu />

                <EffectsMenu />

                <PromptMenu setFocus={setFocus} />
            </div>
        </>
    )
}

function VoicesMenu() {
    // this is probably the stupidest thing ive ever done but it works
    const [mainWaveForm, setMainWaveForm] = useState<WaveForm>("sawtooth");
    configLoader.setWaveform = setMainWaveForm;

    const [unison0WaveForm, setUnison0WaveForm] = useState<WaveForm>("square");
    configLoader.setUnison0WaveForm = setUnison0WaveForm;

    const [unison1WaveForm, setUnison1WaveForm] = useState<WaveForm>("triangle");
    configLoader.setUnison1WaveForm = setUnison1WaveForm;


    useEffect(() => {
        const synth = Synth.getSynth();
        synth.setWaveform(mainWaveForm);
        synth.setUnisonWaveForm(0, unison0WaveForm);
        synth.setUnisonWaveForm(1, unison1WaveForm);
    }, [mainWaveForm, unison0WaveForm, unison1WaveForm]);

    // not needed
    const [mainVolume, setMainVolume] = useState<number>(DEFAULT_MASTER_VOLUME);

    const [unison0Detune, setUnison0Detune] = useState<number>(DEFAULT_DETUNE);
    configLoader.setUnison0Detune = setUnison0Detune;

    const [unison1Detune, setUnison1Detune] = useState<number>(DEFAULT_DETUNE);
    configLoader.setUnison1Detune = setUnison1Detune;

    useEffect(() => {
        const synth = Synth.getSynth();
        // TODO: Make detune slider map properly
        // - remove range from CustomSlider definition
        synth.setVolume(mainVolume);
        synth.setUnisonDetune(0, unison0Detune);
        synth.setUnisonDetune(1, unison1Detune);
    }, [mainVolume, unison0Detune, unison1Detune]);

    return (
        <div className=" ml-5 border w-[45vw] border-black">
            <ul>
                <li className=" p-2">VOICE</li>
                <VoiceSettings
                    waveform={mainWaveForm}
                    setWaveForm={setMainWaveForm}
                    volume={mainVolume}
                    setVolume={setMainVolume}
                />

                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>

                <li className=" p-2">UNISON 1</li>
                <UnisonSettings
                    waveform={unison0WaveForm}
                    setWaveForm={setUnison0WaveForm}
                    detune={unison0Detune}
                    setDetune={setUnison0Detune}
                />

                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>

                <li className=" p-2">UNISON 2</li>
                <UnisonSettings
                    waveform={unison1WaveForm}
                    setWaveForm={setUnison1WaveForm}
                    detune={unison1Detune}
                    setDetune={setUnison1Detune}
                />
            </ul>
        </div>
    )
}

function VoiceSettings({ waveform, setWaveForm, volume, setVolume }) {
    const handleWaveForm = (
        _: React.MouseEvent<HTMLElement>,
        newWaveform: WaveForm | null,
    ) => {
        if (newWaveform !== null) {
            setWaveForm(newWaveform);
        }
    };

    const handleVolume = (
        _: React.MouseEvent<HTMLElement>,
        newVolume: WaveForm | null,
    ) => {
        if (newVolume !== null) {
            setVolume(newVolume);
        }
    };

    return (
        <div>
            {/* TODO: make this a toggle button */}
            <li className=" flex items-center">
                {/* TODO: make this font monospace */}
                <span className=" pl-2 mr-2">WAV</span>
                <ToggleButtonGroup
                    color="primary"
                    value={waveform}
                    onChange={handleWaveForm}
                    exclusive
                >
                    <ToggleButton value="sine">SIN</ToggleButton>
                    <ToggleButton value="square">SQA</ToggleButton>
                    <ToggleButton value="triangle">TRI</ToggleButton>
                    <ToggleButton value="sawtooth">SAW</ToggleButton>
                </ToggleButtonGroup>
            </li>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">VOL</span>
                <CustomSlider
                    min={MIN_MASTER_VOLUME}
                    max={MAX_MASTER_VOLUME}
                    step={0.01}
                    value={volume}
                    onChange={handleVolume} />
            </li>
        </div>
    )
}

function UnisonSettings({ waveform, setWaveForm, detune, setDetune }) {
    const handleWaveForm = (
        _: React.MouseEvent<HTMLElement>,
        newWaveform: WaveForm | null,
    ) => {
        if (newWaveform !== null) {
            setWaveForm(newWaveform);
        }
    };

    const handleDetune = (
        _: React.MouseEvent<HTMLElement>,
        newDetune: WaveForm | null,
    ) => {
        if (newDetune !== null) {
            setDetune(newDetune);

        }
    };

    return (
        <div>
            {/* TODO: make this a toggle button */}
            <li className=" flex items-center">
                {/* TODO: make this font monospace */}
                <span className=" pl-2 mr-2">WAV</span>
                <ToggleButtonGroup
                    color="primary"
                    value={waveform}
                    onChange={handleWaveForm}
                    exclusive
                >
                    <ToggleButton value="sine">SIN</ToggleButton>
                    <ToggleButton value="square">SQA</ToggleButton>
                    <ToggleButton value="triangle">TRI</ToggleButton>
                    <ToggleButton value="sawtooth">SAW</ToggleButton>
                </ToggleButtonGroup>
            </li>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">DET</span>
                <CustomSlider
                    min={MIN_DETUNE}
                    max={MAX_DETUNE}
                    value={detune}
                    onChange={handleDetune} />
            </li>
        </div>
    )
}

function EnvelopesMenu() {
    return (
        <div className="  border w-[45vw] border-black">
            <ul>
                <li className=" p-2">ASDR - VOLUME</li>
                <EnvelopesSettings target="volume" />
                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>
                <li className=" p-2">ASDR - FILTER</li>
                <EnvelopesSettings target="filter" />
            </ul>
        </div>
    )
}

function EnvelopesSettings({ target }: { target: "filter" | "volume" }) {
    const synth = Synth.getSynth();

    const [attack, setAttack] = useState<number>(target == "filter" ? DEFAULT_FILTER_ATTACK : DEFAULT_VOLUME_ATTACK);
    const [decay, setDecay] = useState<number>(target == "filter" ? DEFAULT_FILTER_DECAY : DEFAULT_VOLUME_DECAY);
    const [sustain, setSustain] = useState<number>(target == "filter" ? DEFAULT_FILTER_SUSTAIN : DEFAULT_VOLUME_SUSTAIN);
    const [release, setRelease] = useState<number>(target == "filter" ? DEFAULT_FILTER_RELEASE : DEFAULT_VOLUME_RELEASE);

    if (target == "filter") {
        configLoader.setFilterAttack = setAttack;
        configLoader.setFilterDecay = setDecay;
        configLoader.setFilterSustain = setSustain;
        configLoader.setFilterRelease = setRelease;
    }
    else {
        configLoader.setVolumeAttack = setAttack;
        configLoader.setVolumeDecay = setDecay;
        configLoader.setVolumeSustain = setSustain;
        configLoader.setVolumeRelease = setRelease;
    }

    const handleAttack = (
        _: React.MouseEvent<HTMLElement>,
        newAttack: number,
    ) => {
        setAttack(newAttack)

        if (target == "filter") synth.setFilterAttack(newAttack);
        else synth.setVolumeAttack(newAttack);
    };

    const handleDecay = (
        _: React.MouseEvent<HTMLElement>,
        newDecay: number,
    ) => {
        setDecay(newDecay)
        if (target == "filter") synth.setFilterDecay(newDecay);
        else synth.setVolumeDecay(newDecay);
    };

    const handleSustain = (
        _: React.MouseEvent<HTMLElement>,
        newSustain: number,
    ) => {
        setSustain(newSustain)
        if (target == "filter") synth.setFilterSustain(newSustain);
        else synth.setVolumeSustain(newSustain);
    };

    const handleRelease = (
        _: React.MouseEvent<HTMLElement>,
        newRelease: number,
    ) => {
        setRelease(newRelease)
        if (target == "filter") synth.setFilterRelease(newRelease);
        else synth.setVolumeRelease(newRelease);
    };

    return (
        <>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">ATK</span>
                <CustomSlider
                    min={target == "filter" ?
                        MIN_FILTER_ATTACK : MIN_VOLUME_ATTACK
                    }
                    max={target == "filter" ?
                        MAX_FILTER_ATTACK : MAX_VOLUME_ATTACK
                    }
                    value={attack} onChange={handleAttack} />
            </li>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">DEC</span>
                <CustomSlider
                    min={target == "filter" ?
                        MIN_FILTER_DECAY : MIN_VOLUME_DECAY
                    }
                    max={target == "filter" ?
                        MAX_FILTER_DECAY : MAX_VOLUME_DECAY
                    }
                    value={decay} onChange={handleDecay} />
            </li>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">SUS</span>
                <CustomSlider
                    min={target == "filter" ?
                        MIN_FILTER_SUSTAIN : MIN_VOLUME_SUSTAIN
                    }
                    max={target == "filter" ?
                        MAX_FILTER_SUSTAIN : MAX_VOLUME_SUSTAIN
                    }
                    value={sustain} onChange={handleSustain} />
            </li>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">REL</span>
                <CustomSlider
                    min={target == "filter" ?
                        MIN_FILTER_RELEASE : MIN_VOLUME_RELEASE
                    }
                    max={target == "filter" ?
                        MAX_FILTER_RELEASE : MAX_VOLUME_RELEASE
                    }
                    value={release} onChange={handleRelease} />
            </li>
        </>
    )
}

function EffectsMenu() {
    return (
        <div className="border w-[45vw] border-black">
            <ul>
                <li className=" p-2">FILTER</li>
                <FilterSettings />
                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>
                <li className=" p-2">ECHO</li>
                <EchoSettings />
                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>

                <li className="flex items-center">
                    <Oscilloscope />
                </li>
            </ul>
        </div >
    )
}

function FilterSettings() {
    // TODO: fix the frequency mapping
    const synth = Synth.getSynth();

    const [frequency, setFrequency] = useState(DEFAULT_FILTER_FREQUENCY);
    configLoader.setFilterFrequency = setFrequency;

    const [resonance, setResonance] = useState(DEFAULT_FILTER_RESONANCE);
    configLoader.setFilterResonance = setResonance;

    const handleFrequency = (
        _: React.MouseEvent<HTMLElement>,
        newFrequency: number,
    ) => {
        setFrequency(newFrequency)
        synth.setFilterFrequency(newFrequency);
    };

    const handleResonance = (
        _: React.MouseEvent<HTMLElement>,
        newResonance: number,
    ) => {
        setResonance(newResonance)
        synth.setFilterResonance(newResonance);
    };

    return (
        <>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">FRQ</span>
                {/* filter freq usually works in log scale */}
                <CustomSlider
                    min={MIN_FILTER_FREQUENCY}
                    max={MAX_FILTER_FREQUENCY}
                    scale={(value) => 2 ** value}
                    value={frequency} onChange={handleFrequency} />
            </li>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">RES</span>
                <CustomSlider
                    min={MIN_FILTER_RESONANCE}
                    max={MAX_FILTER_RESONANCE}
                    value={resonance} onChange={handleResonance} />
            </li>
        </>
    )
}

function EchoSettings() {
    const [delay, setDelay] = useState(DEFAULT_ECHO_DELAY);
    configLoader.setEchoDelay = setDelay;

    const [feedback, setFeedback] = useState(DEFAULT_ECHO_FEEDBACK);
    configLoader.setEchoFeedback = setFeedback;

    const synth = Synth.getSynth();

    const handleDelay = (
        _: React.MouseEvent<HTMLElement>,
        newDelay: number,
    ) => {
        setDelay(newDelay)

        synth.setEchoDelay(newDelay);

    };

    const handleFeedback = (
        _: React.MouseEvent<HTMLElement>,
        newFeedback: number,
    ) => {
        setFeedback(newFeedback)

        synth.setEchoFeedback(newFeedback);
    };
    return (
        <>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">DEL</span>
                <CustomSlider
                    scale={(value) => 100 ** value}
                    value={delay} onChange={handleDelay} />
            </li>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">FBK</span>
                <CustomSlider value={feedback} onChange={handleFeedback} />
            </li>
        </>
    )
}

function PromptMenu({ setFocus }) {
    const [text, setText] = useState("");

    return (
        <div className="  border w-[45vw] border-black">
            <ul className=" h-full">
                <li className="h-full ">

                    <textarea
                        className=" resize-none p-10 h-full w-full flex items-end pl-2 pb-0 text-wrap"
                        placeholder="SEND A MESSAGE"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onFocus={() => setFocus("prompt")}
                        onBlur={() => setFocus("main")}
                    />
                </li>
                <button onClick={() => {
                    setText("")
                    prompt(text)
                        .then(
                            (config: SynthConfig) => {
                                ConfigLoader.getConfigLoader().load(config);
                                console.log("set", config);
                            }
                        )
                }}>submit</button>
            </ul>
        </div>
    )
}