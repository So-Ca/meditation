import React, {useState, useEffect} from 'react';
import playSvg from "./assets/icons/play.svg";
import pauseSvg from "./assets/icons/pause.svg";
import rainSvg from "./assets/icons/rain.svg";
import rainVideo from "./assets/video/rain.mp4";
import rainSound from "./assets/sounds/rain.mp3";
import beachSvg from "./assets/icons/beach.svg";
import beachVideo from "./assets/video/beach.mp4";
import beachSound from "./assets/sounds/beach.mp3";

function App() {
// Gestione di play e pause
  const [isPlaying, setIsPlaying] = useState(false);
  let fakeDuration = 600;
  
  function togglePlay(){
    
    const play = document.querySelector(".play");
    const video = document.querySelector(".vid-container video");
    const song = document.querySelector(".song");

    if(isPlaying){
      song.play();
      video.play()
      play.src = pauseSvg;
    } else {
      song.pause();
      video.pause();
      play.src = playSvg;
    }

    setIsPlaying(prevState => !prevState);
  }

// Selezione dei suoni
  function changeSound(event){
    // const sounds = document.querySelectorAll(".sound-picker button");
    const song = document.querySelector(".song");
    const video = document.querySelector(".vid-container video");
    const selectedButton = event.currentTarget;

    song.src = selectedButton.getAttribute("data-sound");
    video.src = selectedButton.getAttribute("data-video");

    togglePlay();
  }

// Selezione della durata
  function changeTime(event){
    const timeDisplay = document.querySelector(".time-display");
    const selectedButton = event.currentTarget;

    fakeDuration = parseInt(selectedButton.dataset.time, 10);
    timeDisplay.textContent = `${Math.floor(fakeDuration / 60)}:${Math.floor(fakeDuration % 60)}`;
  }

// Animazione del cerchio
  function moveOutline(){
    const song = document.querySelector(".song");
    const play = document.querySelector(".play");
    const video = document.querySelector(".vid-container video");
    const timeDisplay = document.querySelector(".time-display");
    const outline = document.querySelector(".moving-outline circle");
    const outlineLength = outline.getTotalLength();

    outline.style.strokeDasharray = outlineLength; // spazia il cerchio nella misura indicata
    outline.style.strokeDashoffset = outlineLength; // riempie il cerchio della misura indicata

    song.ontimeupdate = () => {
      let currentTime = song.currentTime;
      let elapsed = fakeDuration - currentTime;
      let seconds = Math.floor(elapsed % 60);
      let minutes = Math.floor(elapsed / 60);
      let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
      
      outline.style.strokeDashoffset = progress;
      timeDisplay.textContent = `${minutes}:${seconds}`;

      if(currentTime >= fakeDuration) {
        song.pause();
        video.pause();
        song.currentTime = 0;
        play.src = playSvg;
      }
    }
  }

  useEffect( ()=>{
    moveOutline()
  }, [moveOutline] );

  return (
    <div className='app'>
      <div className='vid-container'>
        <video loop>
          <source src={rainVideo} type="video/mp4"/>
        </video>
      </div>
      <div className='time-select'>
        <button onClick={changeTime} data-time="120">2 Minutes</button>
        <button onClick={changeTime} data-time="300">5 Minutes</button>
        <button onClick={changeTime} data-time="600">10 Minutes</button>
      </div>
      <div className='player-container'>
        <audio className='song'>
          <source src={rainSound}/>
        </audio>
        <img onClick={togglePlay} src={playSvg} alt='play' className='play'/>
        <svg className="track-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="226.5" cy="226.5" r="216.5" stroke="white" strokeWidth="20"/>
        </svg>
        <svg className="moving-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="226.5" cy="226.5" r="216.5" stroke="#018EBA" strokeWidth="20"/>
        </svg>
        <h3 className='time-display'>0:00</h3>
      </div>
      <div className='sound-picker'>
        <button onClick={changeSound} data-sound={rainSound} data-video={rainVideo}>
          <img src={rainSvg} alt="rain"/>
        </button>
        <button onClick={changeSound} data-sound={beachSound} data-video={beachVideo}>
          <img src={beachSvg} alt="beach"/>
        </button>
      </div>
    </div>
  )
}

export default App