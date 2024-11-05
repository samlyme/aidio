
import Slider from '@mui/material/Slider';

const CustomSlider = ({
  defaultValue = 0.3,
  width = 200,
  height = 30,
  color = "#d9d9d9",
  borderRadius = 0,
  thumbOpacity = 0,
  max = 1,
  min = 0,
  step = 0.01,
  ...props
}) => {
  return (
    <Slider
      defaultValue={defaultValue}
      max = {max}
      min = {min}
      step = {step}
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
  );
};

export default CustomSlider;