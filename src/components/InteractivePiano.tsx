import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import Synth from '../synth/Synth';
import './customPianoStyles.css';

export default function InteractivePiano({ isTextBoxFocused }) {
    const firstNote = MidiNumbers.fromNote('c3');
    const lastNote = MidiNumbers.fromNote('f4');
    const keyboardShortcuts = KeyboardShortcuts.create({
        firstNote: firstNote,
        lastNote: lastNote,
        keyboardConfig: KeyboardShortcuts.HOME_ROW,
    });

    const synth = Synth.getSynth();

    const playNote = isTextBoxFocused
    ? () => {} 
    : (midiNumber) => synth.playNote(midiNumber, 80);

    const stopNote = isTextBoxFocused
    ? () => {} 
    : (midiNumber) => synth.releaseNote(midiNumber);
  
    return (
         <Piano
            className="ml-20 pb-10"
            noteRange={{ first: firstNote, last: lastNote }}
            playNote={playNote}
            stopNote={stopNote}
            width={1000}
            keyboardShortcuts={keyboardShortcuts}
        />
    );
}
