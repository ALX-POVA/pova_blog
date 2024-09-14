import React from "react";

function Home() {
  return(
    
  <div className="home-wrapper">
    {/* parent container for all elements */}
    <div className="home-container">

      {/* Left side with popular post and videos */}
      <div className="left-side">
    <span className="popular-post">Popular Post</span> {/* left side */}
    {/* Separate container for popular videos */}
    <div className="popular-videos">
      <p className="video-container">Video 1</p>
      <p className="video-container">Video 2</p>
      </div>
      </div>

 
    <span className="popular-post">Popular Post</span> {/* right side */}
    </div>
    </div>
    );
}

export default Home;
