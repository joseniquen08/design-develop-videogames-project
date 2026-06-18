const ENEMY_ESCORT_OFFSET_Y = 220;
const ENEMY_ESCORT_OFFSET_X = 80;

function createEnemy() {
    enemy = game.add.sprite(BATTLE_POSITIONS.enemyX, BATTLE_POSITIONS.enemyY, 'enemyBoat');
    enemy.anchor.setTo(0.5);
    enemy.scale.x = -1;
    enemy.width = 300; enemy.height = 250;
    enemy.animations.add('move', [0, 1, 2, 3], 6, true);
    enemy.animations.play('move');
    game.physics.arcade.enable(enemy);

    enemyTop = game.add.sprite(BATTLE_POSITIONS.enemyX + ENEMY_ESCORT_OFFSET_X, BATTLE_POSITIONS.enemyY - ENEMY_ESCORT_OFFSET_Y, 'enemyBoat');
    enemyTop.anchor.setTo(0.5);
    enemyTop.scale.x = -1;
    enemyTop.width = 300; enemyTop.height = 250;
    enemyTop.animations.add('move', [0, 1, 2, 3], 6, true);
    enemyTop.animations.play('move');
    game.physics.arcade.enable(enemyTop);

    enemyBottom = game.add.sprite(BATTLE_POSITIONS.enemyX + ENEMY_ESCORT_OFFSET_X, BATTLE_POSITIONS.enemyY + ENEMY_ESCORT_OFFSET_Y, 'enemyBoat');
    enemyBottom.anchor.setTo(0.5);
    enemyBottom.scale.x = -1;
    enemyBottom.width = 300; enemyBottom.height = 250;
    enemyBottom.animations.add('move', [0, 1, 2, 3], 6, true);
    enemyBottom.animations.play('move');
    game.physics.arcade.enable(enemyBottom);
}

function checkCollision() {
    [enemy, enemyTop, enemyBottom].forEach((target) => {
        game.physics.arcade.overlap(bullet, target, () => {
            bullet.exists = false;
            bulletActive = false;
            currentHP -= 20;
            updateGrauFace();
            alert('¡Colisión! El Huáscar alcanzó al barco enemigo.');
        });
    });
}