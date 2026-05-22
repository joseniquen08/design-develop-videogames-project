let game = new Phaser.Game(1717, 916, Phaser.CANVAS, 'bloque_juego');

let imgRoute = "img/";

let mainBoat;

let rightKey, leftKey, upKey, downKey;

let initialState = {
    preload: () => {
        game.load.image('background', `${imgRoute}ocean-background.png`);
        game.load.spritesheet('mainBoat', 'img/sprite-boat.png', 231, 192);
    },
    create: () => {
        game.add.tileSprite(0, 0, 1717, 916, 'background');

        mainBoat = game.add.sprite(game.width/2, game.height/2, 'mainBoat');
        
        mainBoat.anchor.setTo(0.1);
        mainBoat.frame = 0;
        //mainBoat.scale = 1;

        mainBoat.animations.add('down',  [1],  8, true);
        mainBoat.animations.add('left',  [5],  8, true);
        mainBoat.animations.add('right', [7], 8, true);
        mainBoat.animations.add('up',    [11], 8, true);

        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

    },
    update: () => {

        if(rightKey.isDown) {
            mainBoat.position.x += 2;
            mainBoat.animations.play('right');
            
        }else if(leftKey.isDown) {
            mainBoat.position.x -= 2;
            mainBoat.animations.play('left');

        }else if(upKey.isDown) {
            mainBoat.position.y -= 2;
            mainBoat.animations.play('up');

        }else if(downKey.isDown) {
            mainBoat.position.y += 2;
            mainBoat.animations.play('down');

        }

    }
}

game.state.add('main', initialState);
game.state.start('main');