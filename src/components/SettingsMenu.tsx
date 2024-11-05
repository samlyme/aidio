import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import ToggleButton from "@mui/material/ToggleButton"
import CustomSlider from "./Slider"
import { useEffect, useState } from "react"
import { WaveForm } from "../synth/Types"
import Synth from "../synth/Synth"

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
    const [unison0WaveForm, setUnison1WaveForm] = useState<WaveForm>("sine");
    const [unison1WaveForm, setUnison2WaveForm] = useState<WaveForm>("sine");

    useEffect(() => {
        const synth = Synth.getSynth();
        synth.setWaveform(mainWaveForm);
        synth.setUnisonWaveForm(0, unison0WaveForm);
        synth.setUnisonWaveForm(1, unison1WaveForm);
    }, [mainWaveForm, unison0WaveForm, unison1WaveForm]);

    return (
        <div className=" ml-5 border w-[45vw] border-black">
            <ul>
                <li className=" p-2">VOICE</li>
                <OscillatorSettings waveform={mainWaveForm} setWaveForm={setMainWaveForm} />

                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>

                <li className=" p-2">UNISON 1</li>
                <OscillatorSettings waveform={unison0WaveForm} setWaveForm={setUnison1WaveForm} />

                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>

                <li className=" p-2">UNISON 2</li>
                <OscillatorSettings waveform={unison1WaveForm} setWaveForm={setUnison2WaveForm} />
            </ul>
        </div>
    )
}

function OscillatorSettings({ waveform, setWaveForm }) {
    const handleWaveForm = (
        _: React.MouseEvent<HTMLElement>,
        newWaveform: WaveForm | null,
    ) => {
        if (newWaveform !== null) {
            setWaveForm(newWaveform);
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
                <CustomSlider />
            </li>
        </div>
    )
}

function EnvelopesMenu() {
    return (
        <div className="  border w-[45vw] border-black">
            <ul>
                <li className=" p-2">ASDR - VOLUME</li>
                <li className=" flex items-center">
                    <span className=" pl-2 mr-2">ATK</span>
                    <CustomSlider />
                </li>
                <li className=" flex items-center">
                    <span className=" pl-2 mr-2">DEC</span>
                    <CustomSlider />
                </li>
                <li className=" flex items-center">
                    <span className=" pl-2 mr-2">SUS</span>
                    <CustomSlider />
                </li>
                <li className=" flex items-center">
                    <span className=" pl-2 mr-2">REL</span>
                    <CustomSlider />
                </li>
                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>
                <li className=" p-2">ASDR - FILTER</li>
                <li className=" flex items-center">
                    <span className=" pl-2 mr-2">ATK</span>
                    <CustomSlider />
                </li>
                <li className=" flex items-center">
                    <span className=" pl-2 mr-2">DEC</span>
                    <CustomSlider />
                </li>
                <li className=" flex items-center">
                    <span className=" pl-2 mr-2">SUS</span>
                    <CustomSlider />
                </li>
                <li className=" flex items-center">
                    <span className=" pl-2 mr-2">REL</span>
                    <CustomSlider />
                </li>
            </ul>
        </div>
    )
}

function EffectsMenu() {
    return (
        <div className="  border w-[45vw] border-black">
            <ul>
                <li className=" p-2">FILTER</li>
                <li className=" flex items-center">
                    <span className=" pl-2 mr-2">FRQ</span>
                    <CustomSlider />
                </li>
                <li className=" flex items-center">
                    <span className=" pl-2 mr-2">RES</span>
                    <CustomSlider />
                </li>
                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>
                <li className=" p-2">ECHO</li>
                <li className=" flex items-center">
                    <span className=" pl-2 mr-2">DEL</span>
                    <CustomSlider />
                </li>
                <li className=" flex items-center">
                    <span className=" pl-2 mr-2">FBK</span>
                    <CustomSlider />
                </li>
                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>
            </ul>
        </div>
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