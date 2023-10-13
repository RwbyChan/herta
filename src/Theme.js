class Theme {

    constructor(id, name) {
        this.id = id;
        this.name = name;

        // extra effects?
        
    }

    getCharacter() {
        let character = '';

        try {
            character = require(`../public/themes/${this.id}/character.png`)
            character = `${process.env.PUBLIC_URL}/themes/${this.id}/character.png`;
        }
        catch(err) {
            console.log('Error loading character skin', err)
            character = `${process.env.PUBLIC_URL}/themes/default/character.png`;
        }
        return character
    }

    getBackground() {
        return '';
    }

}

export default Theme;