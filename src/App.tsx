import Synth from "./services/Synth"

function App() {

  let synth: Synth;

  return (
    <>
    <button onClick={() => {
      synth = new Synth()
    }}>start</button>
    </>
  )
}

export default App
