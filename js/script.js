let game = new Phaser.Game(1717, 916, Phaser.CANVAS, 'bloque_juego');

let background;

let initialState = {
    preload: () => {
        // Sonidos
        game.load.audio('bgBattleSound', 'audio/battle-background-sound.mp3');

        game.load.image('background', 'img/fondo/ocean-background-3.png');
        game.load.spritesheet('mainBoat', 'img/personaje-principal/barco/huascar_sprite_sheet.png', 360, 360);
        game.load.spritesheet('enemyBoat', 'img/enemigos/sprite_sheet_barco_chileno.png', 460, 384);
    },
    create: () => {
        hudInGame.style.display = "flex";

        let music = game.add.audio('bgBattleSound');
        music.loop = true;
        music.volume = 0.05;
        music.play();

        background = game.add.tileSprite(0, 0, 1717, 916, 'background');
        game.physics.startSystem(Phaser.Physics.ARCADE);

        mainBoat = game.add.sprite(BATTLE_POSITIONS.mainBoatX, BATTLE_POSITIONS.mainBoatY, 'mainBoat');
        mainBoat.anchor.setTo(0.5);
        mainBoat.scale.x = -1;
        mainBoat.frame = 1;

        mainBoat.animations.add('right', [0, 1, 2, 3], 8, true);

        game.physics.arcade.enable(mainBoat);

        createEnemy();
        createBullet();
        // setupSpeech();
        updateGrauFace();

        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },
    update: () => {


        if (rightKey.isDown) {
            background.tilePosition.x -= 0.8;
            mainBoat.position.x += 2;
            mainBoat.animations.play('right');
            mainBoat.scale.x = -1;
        }
        else if (leftKey.isDown) {
            mainBoat.position.x -= 2;
            mainBoat.scale.x = 1;
            background.tilePosition.x += 0.8;
        }
        else if (upKey.isDown && mainBoat.position.y > 400) mainBoat.position.y -= 2;
        else if (downKey.isDown) mainBoat.position.y += 2;

        mainBoat.x = Phaser.Math.clamp(mainBoat.x, 0, 1717);
        mainBoat.y = Phaser.Math.clamp(mainBoat.y, 0, 916);

        updateBullet();
        checkCollision();
    }
};

game.state.add('intro', introState);
game.state.add('scene1', scene1State);
game.state.add('scene2', scene2State);
game.state.add('main', initialState);

game.state.start('scene2');