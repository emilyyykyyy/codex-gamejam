import { Scene } from 'phaser';

export class Game extends Scene
{

    constructor ()
    {
        super('Game');
    }

    init(data) {
        this.badEndFound = data.badEndFound;
        this.goodEndFound = data.goodEndFound;
    }

    create ()
    {
        const gameScene = this;

        ///////// Create background /////////
        this.cameras.main.setBackgroundColor(0x808080);
        if (this.goodEndFound) {
            this.add.image(512, 384, 'bg-cafe-good');
        }
        else {
            this.add.image(512, 384, 'bg-cafe');
        }


        
        ///////// Create SFX /////////
        let floorSFX = this.sound.add('floor-sweep');
        let tableSFX = this.sound.add('table-wipe');
        let dishSFX = this.sound.add('dish-clink');
        let windowSFX = this.sound.add('window-wipe');
        let errorSFX = this.sound.add('error-sound');
        let tickSFX = this.sound.add('tick-sound');



        ///////// Create timer /////////
        // Note: Code is modified from this tutorial: https://phasergames.com/phaser-timer-basics-tutorial/
        let timeLeft = 30;

        this.add.image(905, 52, 'timer-box');
        let timeText = this.add.text(865, 20, "00:30", {
            fontFamily: 'qtpi', fontSize: 60, color: '#464248',
            align: 'right'
        });

        let timedEvent = this.time.addEvent({
            delay: 1000, // 1 second
            callback: tick,
            callbackScope: this,
            loop:true,
        });

        let shake = false; // this is used to stop animation from repeating / moving in place
        function tick() {
            timeLeft--;
            timeText.setText(`00:${timeLeft.toString().padStart(2, '0')}`);
            if (timeLeft <= 5) {
                if (timeLeft <= 0) { this.endGame(false); }
                tickSFX.play();
                if (!shake) {
                    textShake.call(this);
                    shake = true;
                    timeText.setColor('#ff0000')
                }
            }
        }
        
        function textShake() { // Tween to warn user that time is running out :(
            this.tweens.add({
                targets: timeText,
                x: {from: timeText.x - 3, to: timeText.x + 3},
                duration: 250,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        }

        ///////// Create custom cursor /////////
        //this.input.setDefaultCursor('url(assets/ui/cursors/defaultCur.png), pointer');
        this.sys.game.canvas.style.cursor = 'url(assets/ui/cursors/defaultCur.png) 0 0, auto';

        // Loads cursor select options and cursor urls
        let handIcon = this.add.sprite(74, 69, 'handIcon').setInteractive();
        let ragIcon = this.add.sprite(75, 175, 'ragIcon').setInteractive();
        let mopIcon = this.add.sprite(75, 282, 'mopIcon').setInteractive();
        let toolUsed = 'default';

        const clickTool = (toolName) => {
            if (toolName === 'hand') {
                toolUsed = 'hand';
                this.sys.game.canvas.style.cursor = 'url(assets/ui/cursors/handCur.png) 0 0, auto';
                handIcon.setTexture('handIconActive');
                ragIcon.setTexture('ragIcon');
                mopIcon.setTexture('mopIcon');
            }
            else if (toolName === 'rag') {
                toolUsed = 'rag';
                this.sys.game.canvas.style.cursor = 'url(assets/ui/cursors/ragCur.png) 0 0, auto';
                handIcon.setTexture('handIcon');
                ragIcon.setTexture('ragIconActive');
                mopIcon.setTexture('mopIcon');
            }
            else { // By assumption, tool is mop
                toolUsed = 'mop';
                this.sys.game.canvas.style.cursor = 'url(assets/ui/cursors/mopCur.png) 0 0, auto';
                handIcon.setTexture('handIcon');
                ragIcon.setTexture('ragIcon');
                mopIcon.setTexture('mopIconActive');
            }
        }

        handIcon.on('pointerdown', () => clickTool('hand'));
        ragIcon.on('pointerdown', () => clickTool('rag'));
        mopIcon.on('pointerdown', () => clickTool('mop'));



        ///////// Create todo board /////////
        this.add.image(53, 554, 'todo-box').setOrigin(0.15, 0.5);

        this.add.text(70, 365, 'TODO:', {
            fontFamily: 'qtpi', fontSize: 60, fontStyle:'bold', color: '#464248',
            letterSpacing: 5,
            align: 'center'
        });

        let todoStyle = {
            fontFamily: 'qtpi', fontSize: 30, color: '#464248',
            lineSpacing: 0.7,
            align: 'left'
        };
        let taskStyle = {
            fontFamily: 'qtpi', fontSize: 25, color: '#D0755B',
            lineSpacing: 0.7,
            align: 'left'
        };
        let taskCompleteStyle = {
            fontFamily: 'qtpi', fontSize: 25, color: '#A3B4A1',
            lineSpacing: 0.7,
            align: 'left'
        };

        let floorTodo = this.add.text(50, 420, 'Clean up floor\nspills', todoStyle);
        let tableTodo = this.add.text(50, 490, 'Tidy up table\nspills', todoStyle);
        let dishTodo = this.add.text(50, 560, 'Pick up dirty\ndishes', todoStyle);
        let windowTodo = this.add.text(50, 630, 'Clean the\nwindows', todoStyle);

        let floorTextCount = this.add.text(110, 450, '(0/4)', taskStyle);
        let tableTextCount = this.add.text(110, 520, '(0/3)', taskStyle);
        let dishTextCount = this.add.text(125, 590, '(0/3)', taskStyle);
        let windowTextCount = this.add.text(150, 660, '(0/1)', taskStyle);

        //// Set click counters for each todo
        let floorElementCount = 0;
        let tableElementCount = 0;
        let dishElementCount = 0; 
        let windowElementCount = 0;

        // Helper method that updates tasks to complete style when finished
        function updateComplete(tasksDone, tasksNeeded, textInstruction, textCount) {
            if (tasksDone == tasksNeeded) {
                textInstruction.setAlpha(0.5);
                textCount.setStyle(taskCompleteStyle);
            }
            // Check Win condition
            if (floorElementCount == 4 && tableElementCount == 3 && dishElementCount == 3 && windowElementCount == 1) {
                gameScene.endGame(true);
            }
        }



        ///////// Create obstacles /////////
        //// Load images
        let counterspill1 = this.add.sprite(659, 412, 'counterspill1').setInteractive();
        let counterdirtyplate1 = this.add.sprite(685, 420, 'counterdirtyplate1').setInteractive();
        let tablespill1 = this.add.sprite(565, 506, 'tablespill1').setInteractive();
        let tablespill2 = this.add.sprite(377, 414, 'tablespill2').setInteractive();
        let dirtyplate1 = this.add.sprite(744, 508, 'dirtyplate1').setInteractive();
        let dirtyplate2 = this.add.sprite(451, 382, 'dirtyplate2').setInteractive();
        let foodspill1 = this.add.sprite(824, 482, 'foodspill1').setInteractive();
        let foodspill2 = this.add.sprite(489, 551, 'foodspill2').setInteractive();
        let wetspill1 = this.add.sprite(619, 629, 'wetspill1').setInteractive();
        let wetspill2 = this.add.sprite(586, 465, 'wetspill2').setInteractive();
        let windowspill = this.add.sprite(431, 295, 'windowspill').setInteractive();

        /// Create animation for obstacle interaction:
        function spriteShake(scene, sprite, alphaVal, onGone) { // Used for spills
            scene.tweens.add({
                targets: sprite,
                rotation: {from: -0.1, to: 0.1},
                duration: 50,
                ease: 'Sine.easeInOut',
                yoyo: true,
                onComplete: () => {
                    sprite.alpha -= alphaVal;
                    if (sprite.alpha < 0.1) {
                        onGone();
                    }
                    else {
                        sprite.setInteractive();
                    }
                }
            });
        }

        function spriteLift(scene, sprite) {
            scene.tweens.add({
                targets: sprite,
                y: sprite.y - 10,
                alpha: 0,
                duration: 100,
                ease: 'Sine.easeInOut',
                repeat: 0,
                onComplete: () => {sprite.destroy()},
            });
        }

        function spriteError(scene, sprite) { // Used when user incorrectly click on obj w/ wrong tool
            scene.tweens.add({
                targets: sprite,
                x: sprite.x+3,
                duration: 50,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: 0,
                onComplete: () => {sprite.setInteractive();},
            });
        }

        ////// Floor
        const clickFloorElement = function() {
            this.disableInteractive();
            if (toolUsed === 'mop') {
                floorSFX.play();
                spriteShake(this.scene, this, 0.33, () => {
                    floorElementCount++;
                    floorTextCount.setText('(' + floorElementCount + '/4)');
                    this.destroy();
                    updateComplete(floorElementCount, 4, floorTodo, floorTextCount);
                });
            }
            else {
                errorSFX.play();
                spriteError(this.scene, this);
            }
        }

        foodspill1.on('pointerdown', clickFloorElement);
        foodspill2.on('pointerdown', clickFloorElement);
        wetspill1.on('pointerdown', clickFloorElement);
        wetspill2.on('pointerdown', clickFloorElement);
        
        ////// Table
        const clickTableElement = function() {
            this.disableInteractive();
            if (toolUsed === 'rag') {
                tableSFX.play();
                spriteShake(this.scene, this, 0.5, () => {
                    tableElementCount++;
                    tableTextCount.setText('(' + tableElementCount + '/3)');
                    this.destroy();
                    updateComplete(tableElementCount, 3, tableTodo, tableTextCount);
                });
            }
            else {
                errorSFX.play();
                spriteError(this.scene, this);
            }
        }
        tablespill1.on('pointerdown', clickTableElement);
        tablespill2.on('pointerdown', clickTableElement);
        counterspill1.on('pointerdown', clickTableElement);

        ////// Dishes
        const clickDishElement = function() {
            if (toolUsed === 'hand') {
                dishSFX.play();
                spriteLift(this.scene, this);
                dishElementCount++;
                dishTextCount.setText('(' + dishElementCount + '/3)');
                updateComplete(dishElementCount, 3, dishTodo, dishTextCount);
            }
            else {
                errorSFX.play();
                spriteError(this.scene, this);
            }
        }
        dirtyplate1.on('pointerdown', clickDishElement);
        dirtyplate2.on('pointerdown', clickDishElement);
        counterdirtyplate1.on('pointerdown', clickDishElement);

        ////// Windows
        const clickWindowElement = function() {
            this.disableInteractive(); // Disables double click bugs
            if (toolUsed === 'rag') {
                windowSFX.play();
                spriteShake(this.scene, this, 0.5, () => {
                    windowElementCount++;
                    windowTextCount.setText('(' + windowElementCount + '/1)');
                    this.destroy();
                    updateComplete(windowElementCount, 1, windowTodo, windowTextCount);
                });
            }
            else {
                errorSFX.play();
                spriteError(this.scene, this);
            }
        }
        windowspill.on('pointerdown', clickWindowElement);
    }

    ///////// Set ending conditions /////////
    endGame(completedTasks) {
        this.scene.pause();
        this.scene.launch('GameComplete', {
            badEndFound: this.badEndFound,
            goodEndFound: this.goodEndFound,
            completeTasks: completedTasks,
        });
    }
}
