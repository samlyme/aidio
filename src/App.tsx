import { useState } from "react"
import InteractivePiano from "./components/InteractivePiano";

function App() {

  const [ready, setReady] = useState<boolean>(false);

  return (
    <>
      {
        ready ? <InteractivePiano/> :
          <button onClick={() => { setReady(true); }}>
            start
          </button>
      }
    </>
  )
}

export default App
