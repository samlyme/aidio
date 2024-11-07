
import Slider from '@mui/material/Slider';

const CustomSlider = ({
  width = 200,
  height = 30,
  color = "#d9d9d9",
  borderRadius = 0,
  thumbOpacity = 0,
  min = 0,
  max = 1,
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
      min={min}
      max={max}
      step={(max-min)/100}
      {...props}
    />
  );
};

export default CustomSlider;