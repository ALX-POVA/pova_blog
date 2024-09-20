import * as React from 'react';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';


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
            alt=""
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

function Article() {
  return (
  <>
    <Stack spacing={2} sx={{ maxWidth: '30ch' }}>
      <Card>
        <Typography level="title-lg">
          Title of the component{' '}
          <Typography
            level="title-lg"
            textColor="var(--joy-palette-success-plainColor)"
            sx={{ fontFamily: 'monospace', opacity: '50%' }}
          >
            title-lg
          </Typography>
        </Typography>
        <Typography level="body-md">
          This is the description of the component that contain some information of
          it.{' '}
          <Typography
            level="body-md"
            textColor="var(--joy-palette-success-plainColor)"
            sx={{ fontFamily: 'monospace', opacity: '50%' }}
          >
            body-md
          </Typography>
        </Typography>
      </Card>
    </Stack>

  <Stack spacing={2} sx={{ maxWidth: '60ch' }}>
    <Card>
      <Typography level="title-lg">
        Title of the component{' '}
      <Typography
        level="title-lg"
        textColor="var(--joy-palette-success-plainColor)"
        sx={{ fontFamily: 'monospace', opacity: '50%' }}
      >
        title-lg
      </Typography>
    </Typography>
  <Typography level="body-md">
    This is the description of the component that contain some information of
    it.{' '}
    <Typography
      level="body-md"
      textColor="var(--joy-palette-success-plainColor)"
      sx={{ fontFamily: 'monospace', opacity: '50%' }}
    >
      body-md
    </Typography>
  </Typography>
</Card>
</Stack>
</>
);
}



export { MediaCover, Article };