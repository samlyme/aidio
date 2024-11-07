import { useState } from "react"
import InteractivePiano from "./components/InteractivePiano";
import SettingsMenu from "./components/SettingsMenu";
import LandingPage from "./components/LandiPage";
import ConfigLoader from "./synth/ConfigLoader";
import { DEFAULT_SYNTH_CONFIG } from "./synth/Constants";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "./index.css"
import { focus, FocusContext } from "./Context";

function App() {
  const configLoader = ConfigLoader.getConfigLoader();

  const [ready, setReady] = useState<boolean>(false);
  const [focus, setFocus] = useState<focus>("main");

  return (
    <>
      {
        ready ?
          ( 
            <>
            <FocusContext.Provider value={focus}>
              <SettingsMenu setFocus={setFocus}/>
              <InteractivePiano focus={focus}/>
              <button onClick={() => {configLoader.load(DEFAULT_SYNTH_CONFIG)}}>
                reset
              </button>
            </FocusContext.Provider>
            </>
          )
          :
         <>
         <LandingPage/>
          <button onClick={() => { setReady(true); }}>
            start
          </button>
          </>
      }


    </>
  )
}

export default App
