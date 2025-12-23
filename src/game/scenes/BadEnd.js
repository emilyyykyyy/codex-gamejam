import { Scene } from 'phaser';

export class BadEnd extends Scene
{
    constructor ()
    {
        super('BadEnd');
    }

    init(data) {
        this.badEndFound = true;
        this.goodEndFound = data.goodEndFound;
    }

    create ()
    {
        this.cameras.main.fadeIn(1000);
        this.sys.game.canvas.style.cursor = 'url(assets/ui/cursors/defaultCur.png) 0 0, auto';

        ///////// Create Background + Textbox /////////
        let cg = this.add.image(512, 384, 'cg-badend');
        let textbox = this.add.image(512, 644, 'text-box');
        let arrownext = this.add.image(943, 720, 'arrow-next');
        let arrowStart = false; // use later so animation doesn't play on repeat
        

        ///////// Create SFX /////////
        let music = this.sound.add("failure-sound");
        music.play();
        


        ///////// Create text w/ typewriter effect /////////\
        // Code is from https://blog.ourcade.co/posts/2020/phaser-3-typewriter-text-effect-bitmap/
        let endingsFound = 0;
        if (this.badEndFound) { endingsFound++; }
        if (this.goodEndFound) { endingsFound++; }

        let finishedTyping = false;

        let message = `You could not clean everything in time and got fired on the\nspot ... I guess it's on to searching for a new job...\n\nBad End (Found ${endingsFound.toString()}/2 endings).`;
        let typedText = this.add.text(512, 636, 
            '', {
            fontFamily: 'qtpi', fontSize: 40, color: '#464248',
        }).setOrigin(0.5);
        let typeAnimation = this.tweens.add({
                                targets: arrownext,
                                x: {from: arrownext.x - 10, to: arrownext.x + 10 },
                                duration: 1000,
                                ease: 'Sine.easeInOut',
                                yoyo: true,
                                repeat: -1,
                                paused: true,
                            });
        let i = 0;
        let typingText = this.time.addEvent({
            delay: 25, 
            loop: true, 
            callback: () =>{
                if (i < message.length) {
                    typedText.text += message[i];
                    i++;
                } else {
                    typingText.remove();
                    finishedTyping = true;
                    this.input.enabled = true;
                    if (!arrowStart) {
                        typeAnimation.play();
                        arrowStart = true;
                    }
                }
            }
        });
        
        this.input.on('pointerdown', () => {
            if (!finishedTyping) {
                typingText.remove();
                typedText.text = message;
                finishedTyping = true;
                this.input.enabled = true;
                if (!arrowStart) {
                    typeAnimation.play();
                    arrowStart = true;
                }
            }
            else{
                this.input.enabled = false;
                this.cameras.main.fadeOut(250);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('MainMenu', {
                        badEndFound: this.badEndFound,
                        goodEndFound: this.goodEndFound,
                    });
                });
            }
        });
    }
}
