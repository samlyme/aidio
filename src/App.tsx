import { useState } from "react"
import InteractivePiano from "./components/InteractivePiano";


import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Slider from '@mui/material/Slider';
import * as React from 'react'

import "./index.css"




function App() {

  const [ready, setReady] = useState<boolean>(false);

  return (
    <>




      {
        ready ?
          (
            
      <><div className=" ml-10 border w-[30vw] border-black">
              <ul>
                <li className=" p-2">VOICE</li>
                <Slider defaultValue={0.3} max={1} min={0} step={0.1} sx={{ width: 200, marginLeft: 2, height: 30, color: "#d9d9d9", borderRadius: 0, '& .MuiSlider-thumb': { opacity: 0 } }} />
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">DET</span>
                  <Slider defaultValue={30} sx={{ width: 200, height: 30, color: "#d9d9d9", borderRadius: 0, '& .MuiSlider-thumb': { opacity: 0 } }} />
                </li>
                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>
                <li className=" p-2">UNISON 1</li>
                <Slider defaultValue={30} sx={{ width: 200, marginLeft: 2, height: 30, color: "#d9d9d9", borderRadius: 0, '& .MuiSlider-thumb': { opacity: 0 } }} />
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">DET</span>
                  <Slider defaultValue={30} sx={{ width: 200, height: 30, color: "#d9d9d9", borderRadius: 0, '& .MuiSlider-thumb': { opacity: 0 } }} />
                </li>
                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>
                <li className=" p-2">UNISON 2</li>
                <Slider defaultValue={30} sx={{ width: 200, marginLeft: 2, height: 30, color: "#d9d9d9", borderRadius: 0, '& .MuiSlider-thumb': { opacity: 0 } }} />
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">DET</span>
                  <Slider defaultValue={30} sx={{ width: 200, height: 30, color: "#d9d9d9", borderRadius: 0, '& .MuiSlider-thumb': { opacity: 0 } }} />
                </li>
              </ul>
            </div><InteractivePiano /></>
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
