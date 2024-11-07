import { useState } from "react"
import InteractivePiano from "./components/InteractivePiano";
import SettingsMenu from "./components/SettingsMenu";
import LandingPage from "./components/LandingPage";



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
         <div className="flex items-center justify-center">
          <button className="text-2xl shadow-lg p-2 mt-4 bg-[#d9d9d9] border-2 border-[#d9d9d9] hover:border-black w-[50%]" onClick={() => { setReady(true); }}>
            start
          </button>
          </div>

         
          </>
      }


    </>
  )
}

export default App
