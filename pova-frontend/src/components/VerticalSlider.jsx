import * as React from 'react';
import Box from '@mui/joy/Box';
import Slider from '@mui/joy/Slider';


export default function VerticalSlider() {
  return (
    <Box sx={{ mx: 'auto', height: 200 }}>
      <Slider
        orientation="vertical"
        aria-label="Always visible"
      />
    </Box>
  );
}

