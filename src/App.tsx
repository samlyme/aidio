import { useState } from "react"
import InteractivePiano from "./components/InteractivePiano";
import SettingsMenu from "./components/SettingsMenu";
import CustomSlider from "./components/Slider";


import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';



import "./index.css"




function App() {

  const [ready, setReady] = useState<boolean>(false);
  const [isTextBoxFocused, setIsTextBoxFocused] = useState(false);

  const handleTextBoxFocus = () => setIsTextBoxFocused(true);
  const handleTextBoxBlur = () => setIsTextBoxFocused(false);

  return (
    <>




      {
        ready ?
          ( 
            <>
         

            <SettingsMenu />
            <InteractivePiano isTextBoxFocused={isTextBoxFocused} />
           
           
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
