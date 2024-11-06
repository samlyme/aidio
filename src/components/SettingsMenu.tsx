import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import ToggleButton from "@mui/material/ToggleButton"
import CustomSlider from "./Slider"
import { useEffect, useState } from "react"
import { WaveForm } from "../synth/Types"
import Synth from "../synth/Synth"
import Oscilloscope from "./Oscilloscope"

export default function SettingsMenu() {

    return (
        <>
            <div className=" flex gap-5 mt-5 mr-5 pb-10">
                <VoicesMenu />

                <EnvelopesMenu />

                <EffectsMenu />

                <PromptMenu />
            </div>
        </>
    )
}

function VoicesMenu() {
    const [mainWaveForm, setMainWaveForm] = useState<WaveForm>("sine");
    const [unison0WaveForm, setUnison0WaveForm] = useState<WaveForm>("sine");
    const [unison1WaveForm, setUnison1WaveForm] = useState<WaveForm>("sine");

    useEffect(() => {
        const synth = Synth.getSynth();
        synth.setWaveform(mainWaveForm);
        synth.setUnisonWaveForm(0, unison0WaveForm);
        synth.setUnisonWaveForm(1, unison1WaveForm);
    }, [mainWaveForm, unison0WaveForm, unison1WaveForm]);

    const [mainDetune, setMainDetune] = useState<number>(0);
    const [unison0Detune, setUnison0Detune] = useState<number>(0);
    const [unison1Detune, setUnison1Detune] = useState<number>(0);

    useEffect(() => {
        const synth = Synth.getSynth();
        console.log(mainDetune);
        // TODO: Make detune slider map properly
        // - remove range from CustomSlider definition
        synth.setUnisonDetune(0, unison0Detune);
        synth.setUnisonDetune(1, unison1Detune);
    }, [mainDetune, unison0Detune, unison1Detune]);

    return (
        <div className=" ml-5 border w-[45vw] border-black">
            <ul>
                <li className=" p-2">VOICE</li>
                <OscillatorSettings
                    waveform={mainWaveForm}
                    setWaveForm={setMainWaveForm}
                    detune={mainDetune}
                    setDetune={setMainDetune}
                />

                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>

                <li className=" p-2">UNISON 1</li>
                <OscillatorSettings
                    waveform={unison0WaveForm}
                    setWaveForm={setUnison0WaveForm}
                    detune={unison0Detune}
                    setDetune={setUnison0Detune}
                />

                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>

                <li className=" p-2">UNISON 2</li>
                <OscillatorSettings
                    waveform={unison1WaveForm}
                    setWaveForm={setUnison1WaveForm}
                    detune={unison1Detune}
                    setDetune={setUnison1Detune}
                />
            </ul>
        </div>
    )
}

function OscillatorSettings({ waveform, setWaveForm, detune, setDetune }) {
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
                <CustomSlider value={detune} onChange={handleDetune} />
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

    const [attack, setAttack] = useState<number>(0.3);
    const [decay, setDecay] = useState<number>(0.3);
    const [sustain, setSustain] = useState<number>(0.3);
    const [release, setRelease] = useState<number>(0.3);

    const handleAttack = (
        _: React.MouseEvent<HTMLElement>,
        newAttack: number,
    ) => {
        setAttack(newAttack)

        if (target == "filter") synth.setFilterAttack(newAttack / 50);
        else synth.setVolumeAttack(newAttack / 50);
    };

    const handleDecay = (
        _: React.MouseEvent<HTMLElement>,
        newDecay: number,
    ) => {
        setDecay(newDecay)
        if (target == "filter") synth.setFilterDecay(newDecay / 50);
        else synth.setVolumeDecay(newDecay / 50);
    };

    const handleSustain = (
        _: React.MouseEvent<HTMLElement>,
        newSustain: number,
    ) => {
        setSustain(newSustain)
        if (target == "filter") synth.setFilterSustain(newSustain / 100);
        else synth.setVolumeSustain(newSustain / 100);
    };

    const handleRelease = (
        _: React.MouseEvent<HTMLElement>,
        newRelease: number,
    ) => {
        setRelease(newRelease)
        if (target == "filter") synth.setFilterRelease(newRelease / 50);
        else synth.setVolumeRelease(newRelease / 50);
    };

    return (
        <>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">ATK</span>
                <CustomSlider value={attack} onChange={handleAttack} />
            </li>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">DEC</span>
                <CustomSlider value={decay} onChange={handleDecay} />
            </li>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">SUS</span>
                <CustomSlider value={sustain} onChange={handleSustain} />
            </li>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">REL</span>
                <CustomSlider value={release} onChange={handleRelease} />
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
    const [frequency, setFrequency] = useState(.3);
    const [resonance, setResonance] = useState(.3);
    const synth = Synth.getSynth();

    const handleFrequency = (
        _: React.MouseEvent<HTMLElement>,
        newFrequency: number,
    ) => {
        setFrequency(newFrequency)
        synth.setFilterFrequency(newFrequency * 200);
    };

    const handleResonance = (
        _: React.MouseEvent<HTMLElement>,
        newResonance: number,
    ) => {
        setResonance(newResonance)
        synth.setFilterResonance(newResonance / 3);
    };

    return (
        <>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">FRQ</span>
                <CustomSlider value={frequency} onChange={handleFrequency} />
            </li>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">RES</span>
                <CustomSlider value={resonance} onChange={handleResonance} />
            </li>
        </>
    )
}

function EchoSettings() {
    const [delay, setDelay] = useState(.3);
    const [feedback, setFeedback] = useState(.3);
    const synth = Synth.getSynth();

    const handleDelay = (
        _: React.MouseEvent<HTMLElement>,
        newDelay: number,
    ) => {
        setDelay(newDelay)
        
        synth.setEchoDelay(newDelay/50);
        console.log(synth.getConfig());
        
    };

    const handleFeedback = (
        _: React.MouseEvent<HTMLElement>,
        newFeedback: number,
    ) => {
        setFeedback(newFeedback)
        console.log(newFeedback);
        
        synth.setEchoFeedback(newFeedback/100);
    };
    return (
        <>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">DEL</span>
                <CustomSlider value={delay} onChange={handleDelay}/>
            </li>
            <li className=" flex items-center">
                <span className=" pl-2 mr-2">FBK</span>
                <CustomSlider value={feedback} onChange={handleFeedback}/>
            </li>
        </>
    )
}

function PromptMenu() {
    return (
        <div className="  border w-[45vw] border-black">
            <ul className=" h-full">
                <li className="h-full "><textarea placeholder="SEND A MESSAGE" className=" resize-none p-10 h-full w-full flex items-end pl-2 pb-0 text-wrap"></textarea></li>
            </ul>
        </div>
    )
}