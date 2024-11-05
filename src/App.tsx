import { useState } from "react"
import InteractivePiano from "./components/InteractivePiano";
import SettingsMenu from "./components/SettingsMenu";
import WelcomeMenu from "./components/WelcomeMenu";

function App() {

  const [ready, setReady] = useState<boolean>(false);

  return (
    <>
      {
        ready ?
          <>
            <SettingsMenu />
            <InteractivePiano />
          </> :
          <WelcomeMenu setReady={setReady}/>
      }
    </>
  )
}

export default App
