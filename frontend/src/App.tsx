import { useState } from "react"
import Synth from "./synth/Synth"
import InteractivePiano from "./components/InteractivePiano";

function App() {

  const [ready, setReady] = useState<boolean>(false);

  return (
    <>
      {
        ready ? <InteractivePiano/> :
          <button onClick={() => { new Synth(); setReady(true); }}>
            start
          </button>
      }
    </>
  )
}

export default App
