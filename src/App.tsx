import { useState } from "react"
import InteractivePiano from "./components/InteractivePiano";
import SettingsMenu from "./components/SettingsMenu";
import LandingPage from "./components/LandiPage";


import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';



import "./index.css"
import { Lan } from "@mui/icons-material";




function App() {

  const [ready, setReady] = useState<boolean>(false);

  return (
    <>



      {
        ready ?
          ( 
            <>
            <SettingsMenu />
            <InteractivePiano/>
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
