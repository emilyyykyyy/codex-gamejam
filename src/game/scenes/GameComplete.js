import { Scene } from 'phaser';

export class GameComplete extends Scene
{
    constructor ()
    {
        super('GameComplete');
    }

    init(data) {
        this.completeTasks = data.completeTasks;
        this.badEndFound = data.badEndFound;
        this.goodEndFound = data.goodEndFound;
    }

    create ()
    {
        ///////// Create SFX /////////
        this.sound.add('completion-sound').play();

        this.input.enabled = false; // Initially let the scene transition before allowing user to move to next scene

        let tint = this.add.rectangle(512,384,1024,768,0xffffff, 0.4).setOrigin(0.5).setAlpha(0); // White tint over entire screen
        let finishText = this.add.text(512, 384, 'Finish!', {
            fontFamily: 'qtpi', fontSize: 120, fontStyle:'bold', color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);
        let instructionText = this.add.text(512, 474, 'Click to continue', {
            fontFamily: 'qtpi', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center',
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: [tint, finishText, instructionText],
            alpha: {from: 0, to: 1},
            duration: 500,
            ease: 'Sine.easeIn',
            onComplete:  () => {
                this.input.enabled = true;
            }
        })

        this.input.once('pointerdown', () => {
            this.input.enabled = false;

            this.cameras.main.fadeOut(500);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop('Game'); // Remove Game
                if (this.completeTasks == true) {
                    this.scene.start('GoodEnd', {
                        badEndFound: this.badEndFound,
                        goodEndFound: this.goodEndFound,
                    });
                }
                else {
                    this.scene.start('BadEnd', {
                        badEndFound: this.badEndFound,
                        goodEndFound: this.goodEndFound,
                    });
                }
            });
        });
    }
}
