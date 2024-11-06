
import Slider from '@mui/material/Slider';

const CustomSlider = ({
  width = 200,
  height = 30,
  color = "#d9d9d9",
  borderRadius = 0,
  thumbOpacity = 0,
  // max = 1,
  // min = 0,
  // step = 0.01,
  ...props
}) => {
  return (
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
      valueLabelDisplay="on"
      {...props}
    />
  );
};

export default CustomSlider;