import * as React from 'react';
import Box from '@mui/joy/Box';
import Slider from '@mui/joy/Slider';
import Add from '@mui/icons-material/Add';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

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

export default function ButtonIcons() {
    return (
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button startDecorator={<Add />}>Write on PovaNote</Button>
        </Button>
      </Box>
    );
  }