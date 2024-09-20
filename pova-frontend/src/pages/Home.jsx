import React from "react";
import '../components/home.css';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/system/Stack'; // Importing MUI components
import ButtonIcons from '../components/Button.jsx';
import VerticalSlider from '../components/VerticalSlider.jsx';
import { Article, MediaCover} from '../components/trends.jsx';


function Home() {
  return (
    <div className="home-wrapper">
      {/* Parent container for all elements */}
      <div className="home-container">
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="stretch">
          {/* Left side with popular posts and videos */}
          <div className="left-side" style={{ flex: 3 }}>
            <Typography variant="h5" gutterBottom>Popular Post</Typography>
            <Stack
              direction={{ xs: 'row', md: 'column' }}
              spacing={2}
              >
                <p>The gossip in town</p>
              <MediaCover /> {/* Reuse the MediaCover component here */}
            </Stack>
          </div>

            {/* Vertical Slider as a separator */}
            <div className="slider-separator" style={{ display: 'flex', alignItems: 'center', minWidth: '50px' }}>
            <VerticalSlider />
          </div>


          {/* Right side */}
          <div className="right-side" style={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom>More Popular Content</Typography>
            <Stack direction="column" spacing={2}> 
            {/* Add any additional content you want on the right */}
              <Article />
            </Stack>
          </div>
        </Stack>
      </div>

      {/* more on blog writes */}
    <div className="write a blog text-background">
      <ButtonIcons />
    </div>

  </div>
  );
}

export default Home;