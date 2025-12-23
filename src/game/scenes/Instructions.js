import { Scene } from 'phaser';

export class Instructions extends Scene
{
    constructor ()
    {
        super('Instructions');
    }

    init(data) {
        this.badEndFound = data.badEndFound;
        this.goodEndFound = data.goodEndFound;
    }

    create () 
    {
        this.sys.game.canvas.style.cursor = 'url(assets/ui/cursors/defaultCur.png) 0 0, auto';

        ///////// Create Background + Textbox /////////
        this.add.image(512, 384, 'bg-instruction');
        let arrownext = this.add.image(943, 700, 'arrow-next');
        this.tweens.add({
            targets: arrownext,
            x: {from: arrownext.x - 10, to: arrownext.x + 10 },
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });
        
        this.input.on('pointerdown', () => {
            this.cameras.main.fadeOut(500);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Game', {
                    badEndFound: this.badEndFound,
                    goodEndFound: this.goodEndFound,
                });
            });
        });
    }
}
