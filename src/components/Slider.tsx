
// import Slider from '@mui/material/Slider';





// const CustomSlider = ({
//   width = 200,
//   height = 30,
//   color = "#d9d9d9",
//   borderRadius = 0,
//   thumbOpacity = 0,
//   // max = 1,
//   // min = 0,
//   // step = 0.01,
//   ...props
// }) => {
//   return (
//     <Slider

//      valueLabelDisplay="on"

//       sx={{
//         width: width,
//         height: height,
//         color: color,
//         borderRadius: borderRadius,
        
//         '& .MuiSlider-thumb': {
//           opacity: thumbOpacity,
//         },
//       }}
//       {...props}
//     />
//   );
// };

// export default CustomSlider;


import Slider from '@mui/material/Slider';
import { useState } from 'react';

const CustomSlider = ({
  width = 200,
  height = 30,
  color = "#d9d9d9",
  borderRadius = 0,
  thumbOpacity = 0,
  min = 0,
  max = 1,
<<<<<<< Updated upstream
  // step = 0.01,
=======
  step = 0.01,
  value: initialValue = 0,
  onChange,
>>>>>>> Stashed changes
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(event, newValue);
    }
  };

  return (
<<<<<<< Updated upstream
    <Slider
      sx={{
        width: width,
        height: height,
        color: color,
        borderRadius: borderRadius,
        '& .MuiSlider-thumb': {
          opacity: thumbOpacity,
        },
      }}
      min={min}
      max={max}
      step={(max-min)/100}
      {...props}
    />
=======
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Slider
        value={value}
        onChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="auto"
        sx={{
          width: width,
          height: height,
          color: color,
          borderRadius: borderRadius,
          '& .MuiSlider-thumb': {
            opacity: thumbOpacity,
          },
        }}
        {...props}
      />
      <span style={{ marginLeft: 7}}>{value}</span> 
    </div>
>>>>>>> Stashed changes
  );
};

export default CustomSlider;
