import React, { useState, createContext, useEffect, Component } from 'react';
import Theme from './Theme';

const DataContext = createContext();

function DataProvider({children}) {
    const [settings, setSettings] = useState({
      background_audio: false,
      background_volume: 0.1,
      audio_volume: 0.5,
      active_theme: '' // save to localstorage 
    });

    const [themes, setThemes] = useState([
      new Theme('default', 'Default'),
      new Theme('shiny', 'Shiny'),
      new Theme('ahri', 'Ahri'),
    ]);

    useEffect(() => {

    }, []);
  
    return (
      <DataContext.Provider value={{settings, setSettings, themes, setThemes}}>
        {children}
      </DataContext.Provider>
    )
}
export { DataProvider, DataContext };


class DataProvider2 extends Component {
  static themes = [
    new Theme('default', 'Default'),
    new Theme('shiny', 'Shiny'),
    new Theme('ahri', 'Ahri'),
  ];

  constructor(props) {
    super(props);

    this.state = {
      themes: DataProvider2.themes,
      settings: this.getSetLocalStorage()
    }
  }

  getSetLocalStorage() {
    let default_settings = {
      background_audio: false,
      background_volume: 0.1,
      audio_volume: 0.5,
      active_theme: DataProvider2.themes[0]
    };

    let settings = localStorage.getItem('settings');
    if(!settings) {
      // create?
      localStorage.setItem('settings', default_settings);
      return default_settings;
    }
    else {
      // validate
      try {
        settings = JSON.parse(settings);
        
        let s = {};
        let issue = false;

        // background_audio
        if(settings.hasOwnProperty('background_audio') && typeof settings.background_audio === 'boolean') {
          s.background_audio = settings.background_audio;
        }
        else {
          issue = true;
          s.background_audio = default_settings.background_audio;
        }

        // background_volume
        if(settings.hasOwnProperty('background_volume') && /^(0(\.\d{1,2})?|1(\.0{1,2})?)$/.test(settings.background_volume)) {
          s.background_volume = settings.background_volume;
        }
        else {
          issue = true;
          s.background_volume = default_settings.background_volume;
        }

        // audio_volume
        if(settings.hasOwnProperty('audio_volume') && /^(0(\.\d{1,2})?|1(\.0{1,2})?)$/.test(settings.audio_volume)) {
          s.audio_volume = settings.audio_volume;
        }
        else {
          issue = true;
          s.audio_volume = default_settings.audio_volume;
        }

        // active_theme
        if(settings.hasOwnProperty('active_theme') && DataProvider2.themes.includes(settings.active_theme)) {
          s.active_theme = settings.active_theme; // TODO: use index?
        }
        else {
          issue = true;
          s.active_theme = default_settings.active_theme;
        }

        // update localstorage if issue in localstorage
        if(issue) {
          localStorage.setItem('settings', s);
        }

        return s;
      } catch(e) {
        localStorage.setItem('settings', default_settings);
        return default_settings;
      }
    }
  }

  componentDidMount() {

  }

  ob = {
    background_audio: {
      type: 'boolean'
    },
    background_volume: {
      type: 'regex',
      regex: ''
    },
    audio_volume: {
      type: 'regex',
      regex: ''
    },
    active_theme: '' // save to localstorage 
  }

}