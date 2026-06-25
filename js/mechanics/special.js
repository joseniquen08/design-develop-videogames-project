let _sndVoz = null;
let _sndCanones = null;

function initSpecialSounds() {
    _sndVoz = game.add.audio('vozCanones', 0.8);
    _sndCanones = game.add.audio('canoonesSonido', 0.6);
}

function updateSpecialBar() {
    const bar = document.getElementById('special-bar');
    const track = document.getElementById('special-bar-track');
    if (!bar) return;
    const pct = (specialBarValue / specialBarMax) * 100;
    bar.style.width = pct + '%';
    if (specialBarValue >= specialBarMax) {
        specialReady = true;
        bar.style.background = '#ff8800';
        if (track) track.style.boxShadow = '0 0 8px #ff8800';
    } else {
        specialReady = false;
        bar.style.background = '#daa520';
        if (track) track.style.boxShadow = 'none';
    }
}

function spawnCausa(x, y) {
    if (!causaGroup) return;

    let spawnX = Phaser.Math.between(100, 700);
    let landY = Phaser.Math.between(Math.floor(game.height * 0.2), Math.floor(game.height * 0.8));
    let causa = causaGroup.create(spawnX, -100, 'causa');
    causa.anchor.setTo(0.5);
    causa.width = 80;
    causa.height = 80;
    causa.body.velocity.x = 0;
    causa.body.velocity.y = 0;

    game.add.tween(causa)
        .to({ y: landY }, 1500, Phaser.Easing.Bounce.Out, true)
        .onComplete.add(() => {
            if (causa && causa.alive) {
                game.add.tween(causa)
                    .to({ alpha: 0.6 }, 700, Phaser.Easing.Linear.None, true, 0, -1, true);
            }
        });

    game.time.events.add(8000, () => {
        if (causa && causa.alive) causa.destroy();
    });
}

function pickupCausa(boat, causa, getHP, setHP, maxHP, updateHUDFn) {
    causa.destroy();
    setHP(Math.min(maxHP, getHP() + 25));
    updateHUDFn();

    specialBarValue = Math.min(specialBarMax, specialBarValue + 1);
    updateSpecialBar();

    let healTxt = game.add.text(boat.x, boat.y - 40, '+25 HP', {
        font: 'bold 22px monospace',
        fill: '#22cc44'
    });
    healTxt.anchor.setTo(0.5);
    game.add.tween(healTxt)
        .to({ y: healTxt.y - 60, alpha: 0 }, 900, Phaser.Easing.Linear.None, true)
        .onComplete.add(() => healTxt.destroy());
}

function activateSpecial(playerSprite, enemyGroups, bossHitConfig) {
    specialActive = true;
    specialReady = false;
    specialBarValue = 0;
    updateSpecialBar();

    if (_sndVoz) _sndVoz.play(); else game.sound.play('vozCanones', 0.8);

    const VOZ_DURATION = 2000;
    game.time.events.add(VOZ_DURATION, function () {
        if (_sndCanones) _sndCanones.play(); else game.sound.play('canoonesSonido', 0.6);
        game.camera.shake(0.025, 500);

        let txt = game.add.text(1717 / 2, 916 / 2 - 100, '¡AYUDA NAVAL!', {
            font: 'bold 52px monospace',
            fill: '#ffd700'
        });
        txt.anchor.setTo(0.5);
        txt.alpha = 0;
        game.add.tween(txt)
            .to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true)
            .onComplete.add(() => {
                game.time.events.add(800, () => {
                    game.add.tween(txt)
                        .to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true)
                        .onComplete.add(() => txt.destroy());
                });
            });

        for (let i = 0; i < 20; i++) {
            game.time.events.add(i * 400, function () {
                let x = Phaser.Math.between(80, 1630);
                let ball = game.add.sprite(x, -60, 'cannonball');
                ball.anchor.setTo(0.5);
                ball.width = 50;
                ball.height = 50;
                ball.animations.add('spin', [0, 1, 2, 3, 4, 5], 12, true);
                ball.animations.play('spin');

                // y de aterrizaje aleatorio para cubrir toda la altura del campo
                let landY = Phaser.Math.between(
                    Math.floor(game.height * 0.1),
                    Math.floor(game.height * 0.9)
                );
                game.add.tween(ball)
                    .to({ y: landY }, Phaser.Math.between(500, 800), Phaser.Easing.Quadratic.In, true)
                    .onComplete.add(function () {
                        let bx = ball.x, by = ball.y;
                        ball.destroy();

                        let exp = game.add.graphics();
                        exp.beginFill(0xff6600, 0.85);
                        exp.drawCircle(bx, by, 70);
                        exp.endFill();

                        let flash = game.add.graphics();
                        flash.beginFill(0xffffff, 0.9);
                        flash.drawCircle(bx, by, 25);
                        flash.endFill();

                        game.add.tween(exp)
                            .to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true)
                            .onComplete.add(() => exp.destroy());
                        game.add.tween(flash)
                            .to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true)
                            .onComplete.add(() => flash.destroy());

                        game.camera.shake(0.007, 120);

                        // Radio 350px — enemigos normales: kill directo
                        enemyGroups.forEach(function (group) {
                            if (!group) return;
                            group.forEachAlive(function (e) {
                                let dx = e.x - bx, dy = e.y - by;
                                if (dx * dx + dy * dy < 350 * 350) e.kill();
                            });
                        });
                        // Boss: daño por mitad de vida (hitFn lo calcula al momento)
                        if (bossHitConfig && bossHitConfig.sprite && bossHitConfig.sprite.alive) {
                            let dx = bossHitConfig.sprite.x - bx;
                            let dy = bossHitConfig.sprite.y - by;
                            if (dx * dx + dy * dy < 350 * 350) bossHitConfig.hitFn();
                        }
                    });
            });
        }

        game.time.events.add(20 * 400 + 1000, function () {
            specialActive = false;
        });
    });
}
