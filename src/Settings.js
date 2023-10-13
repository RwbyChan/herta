import Sheet from 'react-modal-sheet';
import { Component } from 'react';
import DataStorage from './DataStorage';
import { DataContext } from './DataContext';
export default class Settings extends Component {

    // TODO: volume for BG + for click
    static contextType = DataContext;
    constructor(props) {
        super(props);
        this.state = {
          settings: DataStorage._settings,
          isOpen: false,
          dragLock: false
        };
    }

    componentDidMount() {
        DataStorage.subscribe('settings', async (data) => {
            this.setState({ settings: data })
            console.log('UPDATEEEE', data.background_audio)
        });



        // setInterval(() => {
        //     console.log(this.context.settings);
        // }, 1000);

        // setTimeout(() => {
        //     this.context.setSettings('hiiii')
        // }, 2500);

        // setTimeout(() => {
        //     this.context.setSettings('no')
        // }, 5000);

        
    }

    toggleBgAudio = () => {
        DataStorage.setSetting('background_audio', !this.state.settings.background_audio); 
    }

    updateBackgroundAudioVolume = (e) => {
        let vol = e.target;
        console.log(vol.value)

        this.setState({
            background_audio_volume: vol.value 
        })
    }

    updateButtonVolume = (e, type) => {
        const regex = /^(0(\.\d{1,2})?|1(\.0{1,2})?)$/;

        let vol = e.target.value;

        if(regex.test(vol)) {
            // update
            this.setState({
                [type]: vol
            });

            localStorage.setItem(type, vol);
        }
        else {
            // don't update
        }

        console.log(vol, this.state)

        DataStorage.setSetting(type, vol)
    }

    handleRangeMouseDown = () => {
        this.setState({ dragLock: true })
    }

    handleRangeMouseUp = () => {
        this.setState({ dragLock: false })
    }

    render() {
        return (
            <>
                <div id="settings" onClick={() => this.setState({ isOpen: true})}>Settings</div>
        
                <Sheet rootId="root" isOpen={this.state.isOpen} onClose={() => this.setState({ isOpen: false})} snapPoints={[-50, 0.5, 0]} initialSnap={1} disableDrag={this.state.dragLock}>
                    <Sheet.Container>
                        <Sheet.Header />
                        <Sheet.Content>
                            <Sheet.Scroller draggableAt="both">
                                <div style={{fontWeight:'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 0 1rem 0'}}>Settings</div>

                                <div className='menu-block'>
                                    <div onClick={this.toggleBgAudio} className='menu-item'>
                                        {this.state.settings?.background_audio ? 'Pause BG audio' : 'Play BG audio'}
                                    </div>
                                </div>

                                <div className='menu-block'>
                                    <div className='menu-item'>
                                        <span>Background audio volume</span>
                                        <input type="range" min="0" max="1" step="0.01" onMouseDown={this.handleRangeMouseDown} onMouseUp={this.handleRangeMouseUp} value={this.state.settings.background_audio_volume} onDrag={(e) => e.preventDefault()} onChange={(e) => this.updateButtonVolume(e, 'background_audio_volume')}/>
                                    </div>

                                    <div className='menu-item'>
                                        <span>Button volume</span>
                                        <input type="range" min="0" max="1" step="0.01" onMouseDown={this.handleRangeMouseDown} onMouseUp={this.handleRangeMouseUp} value={this.state.settings.button_audio_volume} onChange={(e) => this.updateButtonVolume(e, 'button_audio_volume')}/>
                                    </div>
                                </div>
                            </Sheet.Scroller>
                        </Sheet.Content>
                    </Sheet.Container>
                    <Sheet.Backdrop onTap={() => this.setState({ isOpen: false})}/>
                </Sheet>
            </>
          );
    }
}