import { Scene } from 'phaser';

export class Game extends Scene
{

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        ///////// Create background /////////
        this.cameras.main.setBackgroundColor(0x808080);
        this.add.image(512, 384, 'bg-cafe');



        ///////// Create SFX /////////
        let floorSFX = this.sound.add('floor-sweep');
        let tableSFX = this.sound.add('table-wipe');
        let dishSFX = this.sound.add('dish-clink');
        let windowSFX = this.sound.add('window-wipe');



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
        let floorTodo = this.add.text(50, 420, 'Clean up floor\nspills', todoStyle);
        let tableTodo = this.add.text(50, 490, 'Tidy up table\nspills', todoStyle);
        let dishTodo = this.add.text(50, 560, 'Pick up dirty\ndishes', todoStyle);
        let windowTodo = this.add.text(50, 630, 'Clean the\nwindows', todoStyle);

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

        // Helper method that updates tasks to complete style when finished
        function updateComplete(tasksDone, tasksNeeded, textInstruction, textCount) {
            if (tasksDone == tasksNeeded) {
                textInstruction.setAlpha(0.5);
                textCount.setStyle(taskCompleteStyle);
            }
        }

        let floorTextCount = this.add.text(110, 450, '(0/4)', taskStyle);
        let tableTextCount = this.add.text(110, 520, '(0/3)', taskStyle);
        let dishTextCount = this.add.text(125, 590, '(0/3)', taskStyle);
        let windowTextCount = this.add.text(150, 660, '(0/1)', taskStyle);



        ///////// Create obstacles /////////
        //// Load images
        let counterspill1 = this.add.sprite(659, 412, 'counterspill1').setInteractive();
        let counterdirtyplate1 = this.add.sprite(685, 427, 'counterdirtyplate1').setInteractive();
        let tablespill1 = this.add.sprite(565, 506, 'tablespill1').setInteractive();
        let tablespill2 = this.add.sprite(377, 414, 'tablespill2').setInteractive();
        let dirtyplate1 = this.add.sprite(744, 508, 'dirtyplate1').setInteractive();
        let dirtyplate2 = this.add.sprite(451, 382, 'dirtyplate2').setInteractive();
        let foodspill1 = this.add.sprite(824, 482, 'foodspill1').setInteractive();
        let foodspill2 = this.add.sprite(489, 551, 'foodspill2').setInteractive();
        let wetspill1 = this.add.sprite(619, 629, 'wetspill1').setInteractive();
        let wetspill2 = this.add.sprite(586, 465, 'wetspill2').setInteractive();
        let windowspill = this.add.sprite(431, 295, 'windowspill').setInteractive();

        //// Set click counters and effects for each group
        let floorElementCount = 0;
        let tableElementCount = 0;
        let dishElementCount = 0; 
        let windowElementCount = 0;

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

        ////// Floor
        const clickFloorElement = function() {
            this.disableInteractive();
            floorSFX.play();
            spriteShake(this.scene, this, 0.33, () => {
                floorElementCount++;
                floorTextCount.setText('(' + floorElementCount + '/4)');
                this.destroy();
                updateComplete(floorElementCount, 4, floorTodo, floorTextCount);
            });
        }

        foodspill1.on('pointerdown', clickFloorElement);
        foodspill2.on('pointerdown', clickFloorElement);
        wetspill1.on('pointerdown', clickFloorElement);
        wetspill2.on('pointerdown', clickFloorElement);
        
        ////// Table
        const clickTableElement = function() {
            this.disableInteractive();
            tableSFX.play();
            spriteShake(this.scene, this, 0.5, () => {
                tableElementCount++;
                tableTextCount.setText('(' + tableElementCount + '/3)');
                this.destroy();
                updateComplete(tableElementCount, 3, tableTodo, tableTextCount);
            });
        }
        tablespill1.on('pointerdown', clickTableElement);
        tablespill2.on('pointerdown', clickTableElement);
        counterspill1.on('pointerdown', clickTableElement);

        ////// Dishes
        const clickDishElement = function() {
            dishSFX.play();
            spriteLift(this.scene, this);
            dishElementCount++;
            dishTextCount.setText('(' + dishElementCount + '/3)');
            updateComplete(dishElementCount, 3, dishTodo, dishTextCount);
        }
        dirtyplate1.on('pointerdown', clickDishElement);
        dirtyplate2.on('pointerdown', clickDishElement);
        counterdirtyplate1.on('pointerdown', clickDishElement);

        ////// Windows
        const clickWindowElement = function() {
            this.disableInteractive(); // Disables double click bugs
            windowSFX.play();
            spriteShake(this.scene, this, 0.5, () => {
                windowElementCount++;
                windowTextCount.setText('(' + windowElementCount + '/1)');
                this.destroy();
                updateComplete(windowElementCount, 1, windowTodo, windowTextCount);
            });
        }
        windowspill.on('pointerdown', clickWindowElement);
    }
}
