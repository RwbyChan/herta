import Sheet from 'react-modal-sheet';
import { Component } from 'react';
import DataStorage from './DataStorage';

export default class Skins extends Component {
    constructor(props) {
        super(props);
        this.state = {
          settings: DataStorage._settings,
          isOpen: false
        };
    }

    componentDidMount() {
        DataStorage.subscribe('settings', async (data) => {
            this.setState({ settings: data })
            console.log('UPDATEEEE', data.background_audio)

            console.log('settttt', this.state.settings)
        });
    }

    toggleBgAudio = () => {
        DataStorage.setSetting('background_audio', !this.state.settings.background_audio); 
    }

    setSkin = (skin) => {
        console.log(skin)
        DataStorage.setSetting('active_theme', skin)
    }

    render() {
        return (
            <>
                <div id="settings" onClick={() => this.setState({ isOpen: true})} style={{top: '3.5rem'}}>Skins</div>
        
                <Sheet rootId="root" isOpen={this.state.isOpen} onClose={() => this.setState({ isOpen: false})} snapPoints={[-50, 0.5, 0]} initialSnap={1}>
                    <Sheet.Container>
                        <Sheet.Header />
                        <Sheet.Content>
                            <Sheet.Scroller draggableAt="both">
                                <div style={{fontWeight:'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 0 1rem 0'}}>Skins</div>
        
                                
                                <div className='skins-container'>

                                    { DataStorage.themes.map((theme, index) => (
                                        <div className={`item${this.state.settings?.active_theme.id === theme.id ? ' active' : ''}`} key={theme.id} onClick={(e) => this.setSkin(theme.id)}>
                                            {theme.name}
                                        </div>
                                    ))}
                                    
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