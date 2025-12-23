import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.text(512, 340, 'Now loading...', {
            fontFamily: 'qtpi', fontSize: 40, color: '#464248',
            align: 'center'
        }).setOrigin(0.5);

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(3, 0x464248);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);
        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        // Branding
        this.load.image('logo', 'branding/logo.png');

        // Backgrounds/CGs
        this.load.image('bg-cafe', 'bgs/bg-cafe.png');
        this.load.image('bg-dark', 'bgs/bg-dark.png');
        this.load.image('cg-badend', 'bgs/cg-badend.png');
        this.load.image('cg-goodend', 'bgs/cg-goodend.png');
        this.load.image('cg-opening', 'bgs/cg-opening.png');
        this.load.image('bg-instruction', 'bgs/bg-instruction.png');

        // UI
        this.load.image('timer-box', 'ui/timer-box.png');
        this.load.image('todo-box', 'ui/todo-box.png');
        this.load.image('text-box', 'ui/text-box.png');
        this.load.image('arrow-next', 'ui/arrow-next.png');
        this.load.image('handIcon', 'ui/icons/handicon.png');
        this.load.image('ragIcon', 'ui/icons/ragicon.png');
        this.load.image('mopIcon', 'ui/icons/mopicon.png');
        this.load.image('handIconActive', 'ui/icons/handiconActive.png');
        this.load.image('ragIconActive', 'ui/icons/ragiconActive.png');
        this.load.image('mopIconActive', 'ui/icons/mopiconActive.png');

        // SFX + music
        this.load.audio('bgMusic', 'sfx/beam.mp3')
        this.load.audio('dish-clink', 'sfx/dish-clink.mp3');
        this.load.audio('floor-sweep', 'sfx/floor-sweep.mp3');
        this.load.audio('table-wipe', 'sfx/table-wipe.mp3');
        this.load.audio('window-wipe', 'sfx/window-wipe.mp3');
        this.load.audio('error-sound', 'sfx/error-sound.mp3');
        this.load.audio('tick-sound', 'sfx/tick-sound.mp3');
        this.load.audio('completion-sound', 'sfx/completion-sound.mp3');
        this.load.audio('failure-sound', 'sfx/failure-sound.mp3');
        this.load.audio('success-sound', 'sfx/success-sound.mp3');

        // Obstacles
        this.load.image('counterspill1', 'obstacles/counterspill1.png');
        this.load.image('counterdirtyplate1', 'obstacles/counterdirtyplate1.png');
        this.load.image('dirtyplate1', 'obstacles/dirtyplate1.png');
        this.load.image('dirtyplate2', 'obstacles/dirtyplate2.png');
        this.load.image('foodspill1', 'obstacles/foodspill1.png');
        this.load.image('foodspill2', 'obstacles/foodspill2.png');
        this.load.image('tablespill1', 'obstacles/tablespill1.png');
        this.load.image('tablespill2', 'obstacles/tablespill2.png');
        this.load.image('wetspill1', 'obstacles/wetspill1.png');
        this.load.image('wetspill2', 'obstacles/wetspill2.png');
        this.load.image('windowspill', 'obstacles/windowspill.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        let music = this.sound.add("bgMusic", { loop: true, volume: 0.5 });
        music.play();

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu', {
            badEndFound: false,
            GoodEndFound: false,
        });
        // TODO: switch back to main menu later
    }
}
