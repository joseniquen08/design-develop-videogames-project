let game = new Phaser.Game(1717, 916, Phaser.CANVAS, 'bloque_juego');

let initialState = {
    preload: () => {
        game.load.image('background', 'img/fondo/ocean-background.png');
        game.load.spritesheet('mainBoat', 'img/personaje-principal/barco/huascar_sprite_sheet.png', 360, 360);
        game.load.spritesheet('enemyBoat', 'img/enemigos/sprite_sheet_barco_chileno.png', 460, 384);
    },
    create: () => {
        game.add.tileSprite(0, 0, 1717, 916, 'background');
        game.physics.startSystem(Phaser.Physics.ARCADE);

        mainBoat = game.add.sprite(game.width / 2, game.height / 2, 'mainBoat');
        mainBoat.anchor.setTo(0.5);
        mainBoat.scale.x = -1;
        mainBoat.frame = 1;

        mainBoat.animations.add('right', [0,1,2,3], 8, true);

        game.physics.arcade.enable(mainBoat);

        document.getElementById('grau-face').style.display = 'block';

        createEnemy();
        createBullet();
        setupSpeech();
        updateGrauFace();

        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        leftKey  = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        upKey    = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey  = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },
    update: () => {
        if (rightKey.isDown){ mainBoat.position.x += 2; mainBoat.animations.play('right'); mainBoat.scale.x = -1; }
        else if (leftKey.isDown) { mainBoat.position.x -= 2; mainBoat.scale.x = 1; }
        else if (upKey.isDown && mainBoat.position.y > 400) mainBoat.position.y -= 2;
        else if (downKey.isDown)                          mainBoat.position.y += 2;

        mainBoat.x = Phaser.Math.clamp(mainBoat.x, 0, 1717);
        mainBoat.y = Phaser.Math.clamp(mainBoat.y, 0, 916);

        updateBullet();
        checkCollision();
    }
};

game.state.add('menu', menuState);
game.state.add('main', initialState);
game.state.start('menu');