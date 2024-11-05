import Synth from "./Synth";

export function handleMIDIAccessSuccess(midiAccess: MIDIAccess): void {
    midiAccess.addEventListener("statechange", (event: Event) => updateMIDIDevices(event));

    const inputs: MIDIInputMap = midiAccess.inputs;
    console.log("inputs", inputs);


    inputs.forEach((input: MIDIInput) => {
        // why is the midi getting looped bruh
        input.addEventListener("midimessage", (event: MIDIMessageEvent) => {
            handleMIDIInput(event);
            console.log("add event listener");

        });
    })

    function updateMIDIDevices(event: Event): void {
        console.log("new device", event);
    }
    function handleMIDIInput(event: MIDIMessageEvent): void {
        if (event.data) {
            const [command, note, velocity] = event.data;

            if (command == 254 || command == 248) return;

            if (command == 144 && velocity > 0) {
                Synth.getSynth().playNote(note, velocity);
            }
            else {
                Synth.getSynth().releaseNote(note);
            }
        }
    }
}

export function handleMIDIAccessFailure(): void{
    console.log("failed to access midi");
}