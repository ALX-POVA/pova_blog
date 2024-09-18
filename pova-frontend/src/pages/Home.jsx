import React from "react";
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/system/Stack'; // Importing MUI components

function Home() {
  return (
    <div className="home-wrapper">
      {/* Parent container for all elements */}
      <div className="home-container">
        <Stack direction="row" spacing={2} justifyContent="space-between">
          {/* Left side with popular posts and videos */}
          <div className="left-side">
            <Typography variant="h5" gutterBottom>Popular Post</Typography> 
            <MediaCover /> {/* Reuse the MediaCover component here */}
          </div>

          {/* Right side */}
          <div className="right-side">
            <Typography variant="h5" gutterBottom>More Popular Content</Typography> 
            {/* Add any additional content you want on the right */}
          </div>
        </Stack>
      </div>
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
      <Card component="li" sx={{ minWidth: 300, flexGrow: 1 }}>
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
      <Card component="li" sx={{ minWidth: 300, flexGrow: 1 }}>
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
