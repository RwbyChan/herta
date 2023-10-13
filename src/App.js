import { Component } from 'react';

import styles from './App.css'
import SettingsComp from './Settings';
import Skins from './Skins';

import DataStorage from './DataStorage'
import { DataContext, DataProvider } from './DataContext';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAudio: null,
      settings: DataStorage._settings,
      counter: 0,
      audios: [
        { id: 'kururin', src: process.env.PUBLIC_URL + '/Kururin.mp3', audio: new Audio(process.env.PUBLIC_URL + '/Kururin.mp3') },
        { id: 'kurukuru', src: process.env.PUBLIC_URL + '/Kurukuru.mp3', audio: new Audio(process.env.PUBLIC_URL + '/Kurukuru.mp3') }, // TODO move to themes?
      ]
    };
  }

  componentDidMount() {
    // Set title
    document.title = 'Herta Spinning';

    // do audio
    for (const a of this.state.audios) {
        a.audio.preload = "auto";
    }
    
    let audio = document.getElementById('bg-audio');
    audio.volume = 0.05

    if(localStorage.getItem('counter')) {
      this.setState({ counter: localStorage.getItem('counter') });
    }
    else {
      localStorage.setItem('counter', 0);
    }

    DataStorage.subscribe('settings', async (data) => {
        this.setState({ settings: data })

        audio.volume = this.state.settings.background_audio_volume;
        if (!data.background_audio) {
          audio.pause();
        } else {
          audio.play();
        }
    });
  }

  componentWillUnmount() {
    // update title back to original?
  }

  handleClick(e) {
    // Update counter
    this.setState({ counter: parseInt(this.state.counter) + 1 });
    localStorage.setItem('counter', this.state.counter);

    // Get random audio
    const random = Math.floor(Math.random() * this.state.audios.length);
    let audio = this.state.audios[random].audio.cloneNode();

    // Set audio volume
    audio.volume = Math.min(Math.max(this.state.settings.button_audio_volume, 0), 1);

    // Play audio
    audio.play();

    // Remove audio (create random herta and shoot it to space)
    audio.addEventListener('ended', function() {
      this.remove();
    });

    // Play animation
    this.hertaToSpace();

    // TODO: move somewhere else? - animate button
    let kururin = e.target;
    kururin.parentNode.style.transform = 'scale(1.5)';
    setTimeout(() => {
      kururin.parentNode.style.transform = 'scale(1)';
    }, 200);
  }

  hertaToSpace() {
    // Create the image element
    const div = document.createElement('div');
    div.className = 'sprite-animation'
    div.style.setProperty('--url', 'url(' + this.state.settings.active_theme.getCharacter() + ')');
    div.style.position = 'absolute';
    div.style.transform = 'scale(0.4)';
    div.style.opacity = '0';
    div.style.zIndex = '3'

    let rare = Math.floor(Math.random() * 10) + 1;
    let rare2 = Math.floor(Math.random() * 10) + 1;
    if(rare === rare2) {
      div.style.filter = 'brightness(150%) hue-rotate(45deg) saturate(150%)'
    }

    // Generate random X and Y coordinates within the window dimensions
    const maxX = window.innerWidth - 200; // Adjust the width of the image
    const maxY = window.innerHeight - 200; // Adjust the height of the image
    const randomX = Math.random() * maxX * 0.7;
    const randomY = Math.random() * maxY * 0.7;

    div.style.left = `${randomX}px`;
    div.style.top = `${randomY}px`;

    // Append the image to the document (with opacity transition)
    document.body.appendChild(div);

    // Trigger a reflow to apply the initial styles before fading in
    //  img.offsetHeight; // This line triggers a reflow, don't remove it

    // Fade in the image (opacity transition)
    setTimeout(() => {
      // Fade in the image with opacity transition
      div.style.opacity = '1';
    }, 0);

    /// Apply infinite rotation using JavaScript
    let rotation = 0;
    const rotateImage = () => {
      rotation += 1; // Increment the rotation angle
      div.style.transform = `rotate(${rotation}deg) scale(0.4)`;
      requestAnimationFrame(rotateImage); // Repeat the rotation
    };
    rotateImage(); // Start the rotation animation

    // Use setTimeout to change the position after initial styles are applied
    setTimeout(() => {
      // Randomly generate a target position for the image
      const targetX = Math.random() * maxX;
      const targetY = Math.random() * maxY;

      // Animate the image to the target position
      div.style.transition = 'left 2s, top 2s, opacity 1s'; // Add smooth transitions
      div.style.left = `${targetX}px`;
      div.style.top = `${targetY}px`;
    }, 0); // Delay of 0 milliseconds
    // Flag to track whether the image has been removed

    // Remove the image after the animation completes (with opacity transition)
    div.addEventListener('transitionend', () => {
      // Check if the image still exists in the DOM and hasn't been removed already
      div.style.opacity = '0'; // Fade out the image
        div.addEventListener('transitionend', () => {
          // Remove the image after the fade-out transition
          div.remove()
        });
    });
  }

  render() {
    return (
      <DataProvider>
      <main className="main">
        <SettingsComp />
        <Skins />

        <div id="counter">{this.state.counter}</div>

       
        <audio id='bg-audio' src={ process.env.PUBLIC_URL + '/kururinkurukuru.mp3'} loop />
        <div onClick={(e) => this.handleClick(e)} style={{background:'red', borderRadius:'50%', zIndex: '9999', userSelect: 'none', display:'flex', alignItems:'center', justifyContent:'center', width:'200px', height:'200px',overflow:'hidden', transition: 'all 0.2s', position: 'relative'}}>
          <div style={{"--url": 'url(' + this.state.settings.active_theme.getCharacter() + ')' , position: 'absolute', transform: 'scale(0.4)', transition: 'all 0.2s ease 0s'}} className='sprite-animation'></div>
        </div>
    </main>
    </DataProvider>
    )
  }
}