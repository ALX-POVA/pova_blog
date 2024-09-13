import React from "react";

function Home() {
  return(
    
  <div className="home-wrapper">
    {/* parent container for all elements */}
    <div className="home-container">
    <span className="popular-post">Popular Post</span> {/* left side */}
    <span className="popular-post">Popular Post</span> {/* right side */}
    </div>
     {/* Separate container for popular videos */}
     <div className="popular-videos">
      <p>Video 1</p>
      <p>Video 2</p>
      </div>


    </div>


    )
}

export default Home;
