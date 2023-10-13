import { BehaviorSubject } from "rxjs";
import Theme from "./Theme";

class DataStorage {
    static instance = null;
    test = false;
    themes = [new Theme('default', 'Default')];
    _settings = {
        background_audio: false,
        active_theme: this.themes[0],
        background_audio_volume: 0.1,
        button_audio_volume: 0.5
    };
    
    static getInstance() {
        if (!DataStorage.instance) DataStorage.instance = new DataStorage();
        return DataStorage.instance;
    }

    settingsSubject = new BehaviorSubject(this._settings);
    skinSubject = new BehaviorSubject(this.themes[0]);
    

    setSetting = (setting, value) => {
        if(setting === 'active_theme') {
            let theme = this.themes.filter(item => item.id === value);
            if(theme.length === 0) {
                theme = this.themes[0];
            }
            else {
                theme = theme[0]
            }

            this._settings.active_theme = theme;
        }
        else {
            this._settings[setting] = value;
        }

        this.settingsSubject.next(this._settings);
    }

    subscribe = (type, callback) => {
        const propertyName = type + 'Subject';
        this[propertyName].asObservable().subscribe(callback);
    }

    constructor() {
        this.character = '';
        this.background = '';

        // extra effects?

        // add custom themes
        this.themes.push(
            new Theme('shiny', 'Shiny'),
            new Theme('ahri', 'Ahri'),
        )

        //this._settings.active_theme = 0

        // Set volumes
        if(!localStorage.getItem('background_audio_volume')) {
            localStorage.setItem('background_audio_volume', this._settings.background_audio_volume);
        }
        this._settings.background_audio_volume = localStorage.getItem('background_audio_volume');

        if(!localStorage.getItem('button_audio_volume')) {
            localStorage.setItem('button_audio_volume', this._settings.button_audio_volume);
        }
        this._settings.button_audio_volume = localStorage.getItem('button_audio_volume');

        this.persistSettings();
        this.loadLocalSettings();
    }

    persistSettings() {
        localStorage.setItem('settings', JSON.stringify(this._settings))
    }

    loadLocalSettings() {
        let settings = JSON.parse(localStorage.getItem('settings'));
        
        // validate

        // set to memory
    }
}

export default DataStorage.getInstance();