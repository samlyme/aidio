import { useState } from "react"
import InteractivePiano from "./components/InteractivePiano";
import SettingsMenu from "./components/SettingsMenu";
import LandingPage from "./components/LandiPage";


import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';



import "./index.css"
import ConfigLoader from "./synth/ConfigLoader";
import { DEFAULT_SYNTH_CONFIG } from "./synth/Constants";




function App() {
  const configLoader = ConfigLoader.getConfigLoader();

  const [ready, setReady] = useState<boolean>(false);

  return (
    <>
      {
        ready ?
          ( 
            <>
            <SettingsMenu />
            <InteractivePiano/>
            <button onClick={() => {configLoader.load(DEFAULT_SYNTH_CONFIG)}}>
              reset
            </button>
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
