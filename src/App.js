import { useState, useEffect } from 'react';

import styles from './App.css'

export default function App() {
  const HertaGif = process.env.PUBLIC_URL + '/herta.gif';
  //const cookies = new Cookies();
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [count, setCount] = useState(() => {
    const storedCount = localStorage.getItem('count');
    return storedCount ? parseInt(storedCount, 10) : 0;
  });

   // Use useEffect to save the count value to localStorage whenever it changes
   useEffect(() => {
    //cookies.set('count', count.toString())
    localStorage.setItem('count', count.toString())
  }, [count]);

  const audios = [
    { id: 'kururin', src: process.env.PUBLIC_URL + '/Kururin.mp3' },
    { id: 'kurukuru', src: process.env.PUBLIC_URL + '/Kurukuru.mp3' },
  ];
  const handleClick = (e) => {
    console.log('Div clicked!'); // You can replace this with your custom logic
    const randomElement = audios[Math.floor(Math.random() * audios.length)];
    const audio = document.getElementById(randomElement.id);

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0; // Reset the audio to the beginning
    }


     audio.volume = Math.min(Math.max(localStorage.getItem('volume'), 0), 1);
    audio.play();
    setCurrentAudio(audio);

    // increase counter
    setCount(count + 1);

    // create random herta and shoot it to space
    hertaToSpace();

    let kururin = e.target;



    kururin.style.transform = 'scale(1.5)'
    setTimeout(() => {
      kururin.style.transform = 'scale(1)'
    }, 200);
  };

  const hertaToSpace = () => {
    // Create the image element
  const img = document.createElement('img');
  img.src = HertaGif; // Replace with the actual source URL of HertaGif
  img.style.position = 'absolute';
  img.style.width = '200px';
  img.style.height = '200px';
  img.style.opacity = '0'; // Start with opacity 0
  img.style.zIndex = '2'

  // Generate random X and Y coordinates within the window dimensions
  const maxX = window.innerWidth - 200; // Adjust the width of the image
  const maxY = window.innerHeight - 200; // Adjust the height of the image
  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  img.style.left = `${randomX}px`;
  img.style.top = `${randomY}px`;

  // Append the image to the document (with opacity transition)
  document.body.appendChild(img);

  // Trigger a reflow to apply the initial styles before fading in
//  img.offsetHeight; // This line triggers a reflow, don't remove it

  // Fade in the image (opacity transition)
  setTimeout(() => {
    // Fade in the image with opacity transition
    img.style.opacity = '1';
  }, 0);

 
  /// Apply infinite rotation using JavaScript
  let rotation = 0;
  const rotateImage = () => {
    rotation += 1; // Increment the rotation angle
    img.style.transform = `rotate(${rotation}deg)`;
    requestAnimationFrame(rotateImage); // Repeat the rotation
  };
  rotateImage(); // Start the rotation animation

  // Use setTimeout to change the position after initial styles are applied
  setTimeout(() => {
    // Randomly generate a target position for the image
    const targetX = Math.random() * maxX;
    const targetY = Math.random() * maxY;

    // Animate the image to the target position
    img.style.transition = 'left 2s, top 2s, opacity 1s'; // Add smooth transitions
    img.style.left = `${targetX}px`;
    img.style.top = `${targetY}px`;
  }, 0); // Delay of 0 milliseconds
  // Flag to track whether the image has been removed

  // Remove the image after the animation completes (with opacity transition)
  img.addEventListener('transitionend', () => {
    // Check if the image still exists in the DOM and hasn't been removed already
      img.style.opacity = '0'; // Fade out the image
      img.addEventListener('transitionend', () => {
        // Remove the image after the fade-out transition
        img.remove()
      });

  });
  };


  const toggleBgAudio = () => {
    let audio = document.getElementById('bg-audio');
    audio.volume = 0.05
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <main className="main">
    <div class="stars"></div>
<div class="twinkling"></div>

      <div id="counter">{count}</div>
      <div onClick={toggleBgAudio} id="bgAudioBtn">
      {isPlaying ? 'Pause BG audio' : 'Play BG audio'}
        </div>
      {audios.map((audio) => (
        <audio key={audio.id} id={audio.id} src={audio.src} />
      ))}
      <audio id='bg-audio' src={ process.env.PUBLIC_URL + '/kururinkurukuru.mp3'} />
      <div onClick={handleClick} style={{background:'red', borderRadius:'50%', zIndex: '9999', userSelect: 'none', display:'flex', alignItems:'center', justifyContent:'center', width:'200px', height:'200px',overflow:'hidden', transition: 'all 0.2s'}}>
        <img src={HertaGif} alt="Herta" style={{width:'200px', height:'200px', pointerEvents:'none'}} />
      </div>
    </main>
  )
}