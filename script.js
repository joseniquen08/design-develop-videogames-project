let game = new Phaser.Game(1717, 916, Phaser.CANVAS, 'bloque_juego');

let imgRoute = "img/";

let mainBoat;

let rightKey, leftKey, upKey, downKey, spaceKey;

let bulletActive = false;

let initialState = {
    preload: () => {
        game.load.image('background', `${imgRoute}ocean-background.png`);
        game.load.spritesheet('mainBoat', 'img/sprite-boat.png', 231, 192);
        game.load.spritesheet('enemyBoat', `${imgRoute}sprite-boat-2.png`, 215, 215);
    },
    create: () => {
        game.add.tileSprite(0, 0, 1717, 916, 'background');

        // Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        mainBoat = game.add.sprite(game.width/2, game.height/2, 'mainBoat');
        
        mainBoat.anchor.setTo(0.1);
        mainBoat.frame = 0;
        //mainBoat.scale = 1;
        game.physics.arcade.enable(mainBoat);

        mainBoat.animations.add('down',  [1],  8, true);
        mainBoat.animations.add('left',  [5],  8, true);
        mainBoat.animations.add('right', [7], 8, true);
        mainBoat.animations.add('up',    [11], 8, true);

        // Enemy boat
        enemy = game.add.sprite(1400, game.height / 2, 'enemyBoat');
        enemy.anchor.setTo(0.5);
        enemy.frame = 0;
        enemy.scale.x = -1;

        game.physics.arcade.enable(enemy);

        // Bullet
        let bulletGraphic = game.add.graphics(0, 0);
        bulletGraphic.beginFill(0xfff);
        bulletGraphic.drawCircle(0, 0, 20);
        bulletGraphic.endFill();

        let bulletTexture = bulletGraphic.generateTexture();
        bulletGraphic.destroy();

        bullet = game.add.sprite(-100, -100, bulletTexture);
        bullet.anchor.setTo(0.5);
        bullet.exists = false;

        game.physics.arcade.enable(bullet);

        // keys
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    },
    update: () => {
        // movements
        if(rightKey.isDown) {
            mainBoat.position.x += 2;
            mainBoat.animations.play('right');
            
        }else if(leftKey.isDown) {
            mainBoat.position.x -= 2;
            mainBoat.animations.play('left');

        }else if(upKey.isDown) {
            if(mainBoat.position.y > 400){
                mainBoat.position.y -= 2;
                mainBoat.animations.play('up');
            }

        }else if(downKey.isDown) {
            mainBoat.position.y += 2;
            mainBoat.animations.play('down');

        }

        // Screen limits
        mainBoat.x = Phaser.Math.clamp(mainBoat.x, 0, 1717);
        mainBoat.y = Phaser.Math.clamp(mainBoat.y, 0, 916);

        // Shot with space
        if (spaceKey.justDown && !bulletActive) {
            bullet.reset(mainBoat.x + 150, mainBoat.y + 100);
            bullet.exists = true;
            bulletActive = true;
        }

        // Bullet movement
        if (bulletActive) {
            bullet.x += 10;

            if (bullet.x > 1717) {
                bullet.exists = false;
                bulletActive = false;
            }
        }

        // Collision
        game.physics.arcade.overlap(bullet, enemy, () => {
            bullet.exists = false;
            bulletActive = false;
            alert('¡Colisión! El Huáscar alcanzó al barco enemigo.');
        });

    }
}

game.state.add('main', initialState);
game.state.start('main');