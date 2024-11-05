import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import Synth from '../synth/Synth';

export default function InteractivePiano() {
    const firstNote = MidiNumbers.fromNote('c3');
    const lastNote = MidiNumbers.fromNote('f5');
    const keyboardShortcuts = KeyboardShortcuts.create({
        firstNote: firstNote,
        lastNote: lastNote,
        keyboardConfig: KeyboardShortcuts.HOME_ROW,
    });

    const synth: Synth = new Synth();


    return (
        <Piano
          noteRange={{ first: firstNote, last: lastNote }}
          playNote={(midiNumber) => {
            synth.playNote(midiNumber, 80);
          }}
          stopNote={(midiNumber) => {
            synth.releaseNote(midiNumber);
          }}
          width={1000}
          keyboardShortcuts={keyboardShortcuts}
        />
      );
     
}