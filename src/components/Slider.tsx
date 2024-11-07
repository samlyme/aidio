
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

const CustomSlider = ({
  width = 200,
  height = 30,
  color = "#d9d9d9",
  borderRadius = 0,
  thumbOpacity = 0,
  min = 0,
  max = 1,
  value,
  ...props
}) => {

  return (
    <>
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
        value={value}
        step={(max - min) / 100}
        {...props} />
        <span className="ml-7">{value.toFixed(1)}</span>
    </>
  );
};

export default CustomSlider;
