import { useState } from "react"
import InteractivePiano from "./components/InteractivePiano";


import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';



import "./index.css"
import SettingsMenu from "./components/SettingsMenu";




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
          <button onClick={() => { setReady(true); }}>
            start
          </button>
      }


    </>
  )
}

export default App
