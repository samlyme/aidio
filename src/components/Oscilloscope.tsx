import { useEffect, useRef } from "react";
import Synth from "../synth/Synth"

export default function Oscilloscope() {
    const analyser = Synth.getSynth().getAnalyser();
    const bufferLength = analyser.frequencyBinCount;

    const canvasRef = useRef<any>(null);
    const contextRef = useRef<any>(null);
    const waveArray = new Uint8Array(bufferLength);

    useEffect(() => {
        contextRef.current = canvasRef.current.getContext("2d");
        draw();
    })

    const height = 150;
    const width = 300;
    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(waveArray);

        const canvasCtx = contextRef.current;

        canvasCtx.strokeStyle = "#000000";
        canvasCtx.lineWidth = 3;
        canvasCtx.clearRect(0, 0, width, height);
        canvasCtx.beginPath();
        for (var i = 0; i < waveArray.length; i += 4) {
            const x = (i / waveArray.length) * (width);
            canvasCtx.lineTo(x, (height/2) + waveArray[i] - 128);
        }
        canvasCtx.stroke();
    }

    return (
        <div className="m-3">
            <canvas ref={canvasRef} width={width} height={height} />
        </div>
    )
}
