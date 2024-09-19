import React from "react";
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/system/Stack'; // Importing MUI components
import VerticalSlider from '../components/VerticalSlider';


function Home() {
  return (
    <div className="home-wrapper">
      {/* Parent container for all elements */}
      <div className="home-container">
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="stretch">
          {/* Left side with popular posts and videos */}
          <div className="left-side" style={{ flex:1 }}>
            <Typography variant="h5" gutterBottom>Popular Post</Typography>
            <Stack
              direction={{ xs: 'row', md: 'column' }}
              spacing={2}
              >
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
              <MediaCover />
            </Stack>
          </div>
        </Stack>
      </div>
    </div>

    {/* more on blog writes */}
    <div className="write a blog">
      <ButtonIcons />
    </div>
  );
}

// MediaCover component
function MediaCover() {
  return (
    <Box
      component="ul"
      sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', p: 0, m: 0 }}
    >
      <Card component="li" sx={{ minWidth: 200, flexGrow: 1 }}>
        <CardCover>
          <img
            src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
            srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
            loading="lazy"
            alt="Popular image"
          />
        </CardCover>
        <CardContent>
          <Typography
            level="body-lg"
            textColor="#fff"
            sx={{ fontWeight: 'lg', mt: { xs: 12, sm: 18 } }}
          >
            Image
          </Typography>
        </CardContent>
      </Card>
      <Card component="li" sx={{ minWidth: 200, flexGrow: 1 }}>
        <CardCover>
          <video
            autoPlay
            loop
            muted
            poster="https://assets.codepen.io/6093409/river.jpg"
          >
            <source
              src="https://assets.codepen.io/6093409/river.mp4"
              type="video/mp4"
            />
          </video>
        </CardCover>
        <CardContent>
          <Typography
            level="body-lg"
            textColor="#fff"
            sx={{ fontWeight: 'lg', mt: { xs: 12, sm: 18 } }}
          >
            Video
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );


}

export default Home;
