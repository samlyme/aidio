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
            <div className=" flex gap-5 mt-5 mr-5 pb-10"> 
            <div className=" ml-5 border w-[45vw] border-black">
              <ul>
                <li className=" p-2">VOICE</li>
                <CustomSlider />
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">DET</span>
                  <CustomSlider />
                </li>
                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>
                <li className=" p-2">UNISON 1</li>
                <CustomSlider />
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">DET</span>
                  <CustomSlider />
                </li>
                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>
                <li className=" p-2">UNISON 2</li>
                <CustomSlider />
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">DET</span>
                  <CustomSlider />
                </li>
              </ul>
            </div>


               
            <div className="  border w-[45vw] border-black">
              <ul>
                <li className=" p-2">ASDR - VOLUME</li>
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">ATK</span>
                  <CustomSlider />
                </li>
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">DEC</span>
                  <CustomSlider />
                </li>
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">SUS</span>
                  <CustomSlider />
                </li>
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">REL</span>
                  <CustomSlider />
                </li>
                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>
                <li className=" p-2">ASDR - FILTER</li>
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">ATK</span>
                  <CustomSlider />
                </li>
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">DEC</span>
                  <CustomSlider />
                </li>
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">SUS</span>
                  <CustomSlider />
                </li>
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">REL</span>
                  <CustomSlider />
                </li>
              </ul>
            </div>


            <div className="  border w-[45vw] border-black">
              <ul>
                <li className=" p-2">ASDR - VOLUME</li>
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">ATK</span>
                  <CustomSlider />
                </li>
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">DEC</span>
                  <CustomSlider />
                </li>
                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>
                <li className=" p-2">ASDR - FILTER</li>
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">ATK</span>
                  <CustomSlider />
                </li>
                <li className=" flex items-center">
                  <span className=" pl-2 mr-2">DEC</span>
                  <CustomSlider />
                </li>
                <li><hr className="border-1 border-black pb-12"></hr></li>
                <li><hr className="border-1 border-black"></hr></li>
              </ul>
            </div>

            <div className="  border w-[45vw] border-black">
              <ul className=" h-full">
                <li className="h-full ">
                <textarea
                placeholder="SEND A MESSAGE"
                className="resize-none p-10 h-full w-full flex items-end pl-2 pb-0 text-wrap"
                onFocus={() => setIsTextBoxFocused(true)}
                onBlur={() => setIsTextBoxFocused(false)} 
              ></textarea>
                </li>
              </ul>
            </div>


            </div>
            
            <InteractivePiano isTextBoxFocused={isTextBoxFocused} />
           
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
