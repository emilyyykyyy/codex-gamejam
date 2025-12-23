import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    init(data) {
        this.badEndFound = data.badEndFound;
        this.goodEndFound = data.goodEndFound;
    }

    create ()
    {
        this.sys.game.canvas.style.cursor = 'url(assets/ui/cursors/defaultCur.png) 0 0, auto';
        this.input.enabled = true;
        this.cameras.main.fadeIn(250);
        this.add.image(512, 384, 'cg-opening');

        this.input.on('pointerdown', () => {
            this.cameras.main.fadeOut(250);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                if (this.badEndFound || this.goodEndFound) {
                    this.scene.start('Instructions', {
                        badEndFound: this.badEndFound,
                        goodEndFound: this.goodEndFound,
                    });
                }
                else {
                    this.scene.start('Opening', {
                        badEndFound: this.badEndFound,
                        goodEndFound: this.goodEndFound,
                    });
                }
            });
        });
    }
}
