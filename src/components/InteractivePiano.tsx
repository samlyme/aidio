import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import Synth from '../synth/Synth';

export default function InteractivePiano() {
    const firstNote = MidiNumbers.fromNote('c3');
    const lastNote = MidiNumbers.fromNote('f4');
    const keyboardShortcuts = KeyboardShortcuts.create({
        firstNote: firstNote,
        lastNote: lastNote,
        keyboardConfig: KeyboardShortcuts.HOME_ROW,
    });

    return (
        <Piano
          noteRange={{ first: firstNote, last: lastNote }}
          playNote={(midiNumber) => {
            Synth.playNote(midiNumber, 80);
          }}
          stopNote={(midiNumber) => {
            Synth.releaseNote(midiNumber);
          }}
          width={1000}
          keyboardShortcuts={keyboardShortcuts}
        />
      );
     
}