import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
// import 'react-piano/dist/styles.css';
import Synth from '../synth/Synth';
import { focus } from '../Context';
import './customPianoStyles.css';  // import a set of overrides

export default function InteractivePiano({ focus }: { focus: focus }) {
    const firstNote = MidiNumbers.fromNote('c3');
    const lastNote = MidiNumbers.fromNote('f4');
    const keyboardShortcuts = KeyboardShortcuts.create({
        firstNote: firstNote,
        lastNote: lastNote,
        keyboardConfig: KeyboardShortcuts.HOME_ROW,
    });

    const synth: Synth = Synth.getSynth();


    return (
        <Piano className="ml-20 pb-10"
          noteRange={{ first: firstNote, last: lastNote }}
          playNote={(midiNumber) => {
            if (focus == "prompt") return;
            synth.playNote(midiNumber, 80);
          }}
          stopNote={(midiNumber) => {
            if (focus == "prompt") return;
            synth.releaseNote(midiNumber);
          }}
          width={1000}
          keyboardShortcuts={keyboardShortcuts}
        />
      );
     
}