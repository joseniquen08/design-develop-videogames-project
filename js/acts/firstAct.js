// ACTO 1: Oleadas + Boss Esmeralda (Prat)

let fa1Background;
let fa1Player;
let fa1PlayerBullet, fa1PlayerBulletActive = false;
let fa1Enemies, fa1EnemyBullets, fa1BossEscortGroup;
let fa1HP = 100;
const fa1MaxHP = 100;
let fa1Music;
let fa1Wave = 1;
let fa1Dead = false;
let fa1EnemiesInWave = 0;
let fa1PlayerInvincible = false;

let fa1BossPhase = false;
let fa1Boss = null;
let fa1BossHP = 5;
let fa1BossEscortTimer = null;
let fa1BossEscortAlt = false;
let fa1BossHPBar = null;

let fa1Paused = false;
let fa1PauseOverlay, fa1PauseText;
let fa1PauseKey;

let fa1RightKey, fa1LeftKey, fa1UpKey, fa1DownKey, fa1SpaceKey;
let fa1WKey, fa1AKey, fa1SKey, fa1DKey;

const fa1WaveConfigs = [
    { count: 3, speed: 100, fireRate: 2200 },
    { count: 4, speed: 115, fireRate: 2000 },
    { count: 5, speed: 130, fireRate: 1800 },
];

let firstActState = {
    preload: () => {
        game.load.image('bg-fa1', 'img/fondo/ocean-background-3.png');
        game.load.spritesheet('player-fa1', 'img/personaje-principal/barco/huascar_sprite_sheet.png', 360, 360);
        game.load.spritesheet('enemy-fa1', 'img/enemigos/sprite_sheet_barco_chileno-2.png', 690, 576);
        game.load.audio('bgMusicFa1', 'audio/battle-background-sound.mp3');
    },

    create: () => {
        fa1Wave = 1;
        fa1HP = 100;
        fa1Dead = false;
        fa1Paused = false;
        fa1EnemiesInWave = 0;
        fa1PlayerBulletActive = false;
        fa1PlayerInvincible = false;
        fa1BossPhase = false;
        fa1Boss = null;
        fa1BossHP = 5;
        fa1BossEscortTimer = null;
        fa1BossEscortAlt = false;
        fa1BossHPBar = null;

        let hud = document.getElementById('hud-main2');
        if (hud) hud.style.display = 'flex';
        hudInGame.style.display = 'none';
        updateFa1HUD();

        fa1Music = game.add.audio('bgMusicFa1');
        fa1Music.loop = true;
        fa1Music.volume = 0.15;
        fa1Music.play();

        fa1Background = game.add.tileSprite(0, 0, 1717, 916, 'bg-fa1');

        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Huáscar
        fa1Player = game.add.sprite(200, 916 / 2, 'player-fa1');
        fa1Player.anchor.setTo(0.5);
        fa1Player.scale.x = -1;
        fa1Player.frame = 1;
        fa1Player.animations.add('right', [0, 1, 2, 3], 8, true);
        game.physics.arcade.enable(fa1Player);

        // Bala jugador
        let pBD = game.make.bitmapData(20, 20);
        pBD.ctx.beginPath();
        pBD.ctx.arc(10, 10, 10, 0, Math.PI * 2);
        pBD.ctx.fillStyle = '#ffffff';
        pBD.ctx.fill();
        fa1PlayerBullet = game.add.sprite(-200, -200, pBD);
        fa1PlayerBullet.anchor.setTo(0.5);
        fa1PlayerBullet.exists = false;
        game.physics.arcade.enable(fa1PlayerBullet);

        // Bala enemiga
        let eBD = game.make.bitmapData(16, 16);
        eBD.ctx.beginPath();
        eBD.ctx.arc(8, 8, 8, 0, Math.PI * 2);
        eBD.ctx.fillStyle = '#ff3333';
        eBD.ctx.fill();

        fa1EnemyBullets = game.add.group();
        for (let i = 0; i < 50; i++) {
            let b = game.add.sprite(-200, -200, eBD);
            b.anchor.setTo(0.5);
            b.exists = false;
            game.physics.arcade.enable(b);
            fa1EnemyBullets.add(b);
        }

        fa1Enemies = game.add.group();
        fa1Enemies.enableBody = true;
        fa1Enemies.physicsBodyType = Phaser.Physics.ARCADE;

        fa1BossEscortGroup = game.add.group();
        fa1BossEscortGroup.enableBody = true;
        fa1BossEscortGroup.physicsBodyType = Phaser.Physics.ARCADE;

        // Input
        fa1RightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        fa1LeftKey  = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        fa1UpKey    = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        fa1DownKey  = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        fa1SpaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        fa1WKey     = game.input.keyboard.addKey(Phaser.Keyboard.W);
        fa1AKey     = game.input.keyboard.addKey(Phaser.Keyboard.A);
        fa1SKey     = game.input.keyboard.addKey(Phaser.Keyboard.S);
        fa1DKey     = game.input.keyboard.addKey(Phaser.Keyboard.D);
        fa1PauseKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

        // Overlay de pausa — añadido al final para quedar encima de todo
        fa1PauseOverlay = game.add.graphics();
        fa1PauseOverlay.beginFill(0x000000, 0.5);
        fa1PauseOverlay.drawRect(0, 0, 1717, 916);
        fa1PauseOverlay.endFill();
        fa1PauseOverlay.visible = false;

        fa1PauseText = game.add.text(1717 / 2, 916 / 2, 'JUEGO EN PAUSA\n\nHaz clic o di "continuar" para reanudar', {
            font: 'bold 48px monospace',
            fill: '#ffffff',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 1200
        });
        fa1PauseText.anchor.setTo(0.5);
        fa1PauseText.visible = false;

        setupFa1Voice();
        spawnFa1Wave();
    },

    update: () => {
        if (fa1Dead) return;

        // Pausa: ESC alterna, click despausa
        if (fa1PauseKey.justDown) toggleFa1Pause();

        if (fa1Paused) {
            if (game.input.activePointer.justPressed()) resumeFa1();
            return;
        }

        fa1Background.tilePosition.x -= 1;

        // Movimiento jugador
        if (fa1RightKey.isDown || fa1DKey.isDown) {
            fa1Player.x += 2;
            fa1Player.animations.play('right');
            fa1Player.scale.x = -1;
        } else if (fa1LeftKey.isDown || fa1AKey.isDown) {
            fa1Player.x -= 2;
            fa1Player.scale.x = 1;
        } else if (fa1UpKey.isDown || fa1WKey.isDown) {
            fa1Player.y -= 2;
        } else if (fa1DownKey.isDown || fa1SKey.isDown) {
            fa1Player.y += 2;
        }

        fa1Player.x = Phaser.Math.clamp(fa1Player.x, 0, 800);
        fa1Player.y = Phaser.Math.clamp(fa1Player.y, 0, 916);

        // Disparo
        if (fa1SpaceKey.justDown && !fa1PlayerBulletActive) fireFa1PlayerBullet();

        if (fa1PlayerBulletActive && fa1PlayerBullet.x > 1800) {
            fa1PlayerBullet.exists = false;
            fa1PlayerBulletActive = false;
        }

        // Enemigos de oleada
        fa1Enemies.forEachAlive((e) => {
            e.fireTimer -= game.time.elapsed;
            if (e.fireTimer <= 0) {
                e.fireTimer = fa1WaveConfigs[Math.min(fa1Wave - 1, 2)].fireRate + Phaser.Math.between(-300, 300);
                fireFa1EnemyBullet(e);
            }
            if (!fa1PlayerInvincible) {
                let dx = e.x - fa1Player.x, dy = e.y - fa1Player.y;
                if (dx * dx + dy * dy < 120 * 120) { e.kill(); takeDamageFa1(35); }
            }
            if (e.x < -250) e.kill();
        });

        // Escolta del boss
        fa1BossEscortGroup.forEachAlive((e) => {
            e.fireTimer -= game.time.elapsed;
            if (e.fireTimer <= 0) {
                e.fireTimer = 2000 + Phaser.Math.between(-300, 300);
                fireFa1EnemyBullet(e);
            }
            if (!fa1PlayerInvincible) {
                let dx = e.x - fa1Player.x, dy = e.y - fa1Player.y;
                if (dx * dx + dy * dy < 110 * 110) { e.kill(); takeDamageFa1(30); }
            }
            if (e.x < -250) e.kill();
        });

        // Balas enemigas
        fa1EnemyBullets.forEachExists((b) => {
            if (b.x < -60 || b.x > 1800 || b.y < -60 || b.y > 980) { b.kill(); return; }
            if (!fa1PlayerInvincible) {
                let dx = b.x - fa1Player.x, dy = b.y - fa1Player.y;
                if (dx * dx + dy * dy < 60 * 60) { b.kill(); takeDamageFa1(25); }
            }
        });

        // Bala jugador vs oleada
        game.physics.arcade.overlap(fa1PlayerBullet, fa1Enemies, (pBullet, e) => {
            pBullet.exists = false; fa1PlayerBulletActive = false; e.kill();
        });

        // Bala jugador vs escolta boss
        game.physics.arcade.overlap(fa1PlayerBullet, fa1BossEscortGroup, (pBullet, e) => {
            pBullet.exists = false; fa1PlayerBulletActive = false; e.kill();
        });

        // Bala jugador vs boss (manual)
        if (fa1BossPhase && fa1Boss && fa1Boss.alive && fa1PlayerBullet.exists) {
            let dx = fa1PlayerBullet.x - fa1Boss.x;
            let dy = fa1PlayerBullet.y - fa1Boss.y;
            if (dx * dx + dy * dy < 200 * 200) {
                fa1PlayerBullet.exists = false;
                fa1PlayerBulletActive = false;
                hitFa1Boss();
            }
        }

        // Boss: disparo + melee + seguimiento de la barra de HP
        if (fa1BossPhase && fa1Boss && fa1Boss.alive) {
            fa1Boss.fireTimer -= game.time.elapsed;
            if (fa1Boss.fireTimer <= 0) {
                fa1Boss.fireTimer = 1800 + Phaser.Math.between(-200, 200);
                fireFa1BossBurst();
            }
            if (!fa1PlayerInvincible) {
                let dx = fa1Boss.x - fa1Player.x, dy = fa1Boss.y - fa1Player.y;
                if (dx * dx + dy * dy < 220 * 220) takeDamageFa1(40);
            }
            // Barra de HP sigue al boss
            if (fa1BossHPBar) {
                fa1BossHPBar.x = fa1Boss.x;
                fa1BossHPBar.y = fa1Boss.y + 230;
            }
        }

        // Fin de oleada
        if (!fa1BossPhase && fa1EnemiesInWave > 0 && fa1Enemies.countLiving() === 0) {
            fa1EnemiesInWave = 0;
            if (fa1Wave < 3) {
                fa1Wave++;
                game.time.events.add(1500, spawnFa1Wave);
            } else {
                game.time.events.add(2000, startFa1BossPhase);
            }
        }
    }
};

// Pausa

function pauseFa1() {
    if (fa1Dead || fa1Paused) return;
    fa1Paused = true;
    game.physics.arcade.isPaused = true;  // detiene velocity de todos los bodies
    game.tweens.pauseAll();               // detiene oscilación del boss
    game.time.events.pause();             // detiene el timer de escolta
    game.world.bringToTop(fa1PauseOverlay);
    game.world.bringToTop(fa1PauseText);
    fa1PauseOverlay.visible = true;
    fa1PauseText.visible = true;
}

function resumeFa1() {
    if (!fa1Paused) return;
    fa1Paused = false;
    game.physics.arcade.isPaused = false;
    game.tweens.resumeAll();
    game.time.events.resume();
    fa1PauseOverlay.visible = false;
    fa1PauseText.visible = false;
}

function toggleFa1Pause() {
    if (fa1Paused) resumeFa1(); else pauseFa1();
}

// Oleadas

function spawnFa1Wave() {
    const cfg = fa1WaveConfigs[Math.min(fa1Wave - 1, 2)];
    const diff = window.DIFFICULTY_SETTINGS[window.gameDifficulty || 'normal'];
    fa1EnemiesInWave = cfg.count;

    for (let i = 0; i < fa1EnemiesInWave; i++) {
        let yPos = (916 / (fa1EnemiesInWave + 1)) * (i + 1);

        let xPos = (fa1Wave === 1)
            ? BATTLE_POSITIONS.enemyX + (i === 1 ? 0 : 80)
            : 1717 + i * 200;
        let e = fa1Enemies.create(xPos, yPos, 'enemy-fa1');
        e.anchor.setTo(0.5);
        e.scale.x = -1;
        e.width = 300; e.height = 250;
        e.animations.add('move', [0, 1, 2, 3], 6, true);
        e.animations.play('move');
        e.body.velocity.x = -Math.round(cfg.speed * diff.speedMult);
        e.fireTimer = Math.round(cfg.fireRate * diff.fireRateMult) + Phaser.Math.between(0, 1500);
    }

    let waveEl = document.getElementById('wave-counter');
    if (waveEl) waveEl.textContent = 'Oleada ' + fa1Wave;
}

// Boss (Esmeralda / Prat)

function startFa1BossPhase() {
    if (fa1Dead) return;
    fa1BossPhase = true;

    let waveEl = document.getElementById('wave-counter');
    if (waveEl) waveEl.textContent = '¡ESMERALDA!';

    fa1Boss = game.add.sprite(1717 + 300, 916 / 2, 'enemy-fa1');
    fa1Boss.anchor.setTo(0.5);
    fa1Boss.scale.x = -1;
    fa1Boss.width = 500;
    fa1Boss.height = 420;
    fa1Boss.animations.add('move', [0, 1, 2, 3], 6, true);
    fa1Boss.animations.play('move');
    fa1Boss.fireTimer = 3000;

    // Barra de HP del boss — sigue al sprite en update()
    fa1BossHPBar = game.add.graphics();
    fa1BossHPBar.x = fa1Boss.x;
    fa1BossHPBar.y = fa1Boss.y + 230;
    drawFa1BossHPBar();

    game.add.tween(fa1Boss)
        .to({ x: 1350 }, 2200, Phaser.Easing.Quadratic.Out, true)
        .onComplete.add(() => {
            game.add.tween(fa1Boss)
                .to({ y: 916 / 2 + 130 }, 2200, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
        });

    fa1BossEscortTimer = game.time.events.loop(2500, spawnFa1BossEscort);
}

function spawnFa1BossEscort() {
    if (fa1Dead || !fa1BossPhase) return;
    fa1BossEscortAlt = !fa1BossEscortAlt;
    let yPos = fa1BossEscortAlt ? 916 * 0.15 : 916 * 0.85;
    let e = fa1BossEscortGroup.create(1717 + 100, yPos, 'enemy-fa1');
    e.anchor.setTo(0.5);
    e.scale.x = -1;
    e.width = 270; e.height = 225;
    e.animations.add('move', [0, 1, 2, 3], 6, true);
    e.animations.play('move');
    e.body.velocity.x = -130;
    e.fireTimer = 1200 + Phaser.Math.between(0, 800);
}

function drawFa1BossHPBar() {
    if (!fa1BossHPBar) return;
    fa1BossHPBar.clear();
    // Fondo oscuro
    fa1BossHPBar.beginFill(0x111111, 0.85);
    fa1BossHPBar.drawRect(-100, 0, 200, 14);
    fa1BossHPBar.endFill();
    // Relleno rojo proporcional al HP
    let fillW = Math.max(0, Math.floor((fa1BossHP / 5) * 196));
    fa1BossHPBar.beginFill(0xe53e3e, 1);
    fa1BossHPBar.drawRect(-98, 2, fillW, 10);
    fa1BossHPBar.endFill();
    // Borde blanco sutil
    fa1BossHPBar.lineStyle(1, 0xffffff, 0.4);
    fa1BossHPBar.drawRect(-100, 0, 200, 14);
}

function hitFa1Boss() {
    if (!fa1Boss || !fa1Boss.alive) return;
    fa1BossHP--;
    fa1Boss.tint = 0xff4444;
    game.time.events.add(300, () => { if (fa1Boss) fa1Boss.tint = 0xffffff; });
    game.camera.shake(0.01, 200);
    drawFa1BossHPBar();
    if (fa1BossHP <= 0) defeatFa1Boss();
}

function defeatFa1Boss() {
    if (fa1Dead) return;
    if (fa1BossEscortTimer) game.time.events.remove(fa1BossEscortTimer);
    fa1Boss.kill();
    if (fa1BossHPBar) { fa1BossHPBar.destroy(); fa1BossHPBar = null; }

    let waveEl = document.getElementById('wave-counter');
    if (waveEl) waveEl.textContent = '¡VICTORIA!';

    game.add.tween(fa1Music)
        .to({ volume: 0 }, 800, Phaser.Easing.Linear.None, true)
        .onComplete.add(() => {
            fa1Music.stop();
            let flash = game.add.graphics();
            flash.beginFill(0xffffff, 1);
            flash.drawRect(0, 0, 1717, 916);
            flash.endFill();
            flash.alpha = 0;
            game.add.tween(flash)
                .to({ alpha: 0.9 }, 300, Phaser.Easing.Linear.None, true)
                .onComplete.add(() => {
                    let hud = document.getElementById('hud-main2');
                    if (hud) hud.style.display = 'none';
                    game.state.start('intro2');
                });
        });
}

// Disparo

function fireFa1PlayerBullet() {
    fa1PlayerBulletActive = true;
    fa1PlayerBullet.reset(fa1Player.x + 120, fa1Player.y);
    fa1PlayerBullet.body.velocity.x = 600;
    fa1PlayerBullet.body.velocity.y = 0;
    fa1PlayerBullet.exists = true;
}

function fireFa1EnemyBullet(enemy) {
    if (fa1Dead || !enemy.alive) return;
    let b = fa1EnemyBullets.getFirstExists(false);
    if (!b) return;
    b.reset(enemy.x - 30, enemy.y);
    let dx = fa1Player.x - enemy.x;
    let dy = fa1Player.y - enemy.y;
    let dist = Math.sqrt(dx * dx + dy * dy) || 1;
    b.body.velocity.x = (dx / dist) * 280;
    b.body.velocity.y = (dy / dist) * 280;
    b.exists = true;
}

function fireFa1BossBurst() {
    if (fa1Dead || !fa1Boss || !fa1Boss.alive) return;
    [-15, 0, 15].forEach((deg) => {
        let b = fa1EnemyBullets.getFirstExists(false);
        if (!b) return;
        b.reset(fa1Boss.x - 60, fa1Boss.y);
        let base = Math.atan2(fa1Player.y - fa1Boss.y, fa1Player.x - fa1Boss.x);
        let angle = base + deg * Math.PI / 180;
        b.body.velocity.x = Math.cos(angle) * 300;
        b.body.velocity.y = Math.sin(angle) * 300;
        b.exists = true;
    });
}

// ── Daño / HUD

function takeDamageFa1(amount) {
    if (fa1Dead || fa1PlayerInvincible) return;

    fa1HP = Math.max(0, fa1HP - amount);
    updateFa1HUD();

    fa1Player.exists = true;
    fa1Player.alive = true;
    fa1Player.visible = true;

    fa1Player.tint = 0xff4444;
    fa1PlayerInvincible = true;
    game.time.events.add(1000, () => {
        if (fa1Player) fa1Player.tint = 0xffffff;
        fa1PlayerInvincible = false;
    });

    game.camera.shake(0.015, 300);

    let flash = game.add.graphics();
    flash.beginFill(0xff0000, 0.5);
    flash.drawRect(0, 0, 1717, 916);
    flash.endFill();
    game.add.tween(flash)
        .to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true)
        .onComplete.add(() => flash.destroy());

    if (fa1HP <= 0) gameOverFa1();
}

function updateFa1HUD() {
    let face = document.getElementById('grau-face-2');
    if (face) {
        if (fa1HP > 50) {
            face.src = 'img/personaje-principal/cara/sprite-miguel-grau-normal.png';
        } else if (fa1HP > 25) {
            face.src = 'img/personaje-principal/cara/sprite-miguel-grau-herido-50.png';
        } else {
            face.src = 'img/personaje-principal/cara/sprite-miguel-grau-herido-80.png';
        }
    }
    let hpBar = document.getElementById('hp-bar');
    if (hpBar) hpBar.style.width = (fa1HP / fa1MaxHP * 100) + '%';
}

// Game over → reinicia el acto

function gameOverFa1() {
    fa1Dead = true;
    fa1Enemies.setAll('body.velocity.x', 0);
    fa1Enemies.setAll('body.velocity.y', 0);
    fa1BossEscortGroup.setAll('body.velocity.x', 0);
    fa1BossEscortGroup.setAll('body.velocity.y', 0);
    fa1EnemyBullets.callAll('kill', null);
    if (fa1BossEscortTimer) game.time.events.remove(fa1BossEscortTimer);
    if (fa1Boss && fa1Boss.alive) fa1Boss.kill();
    if (fa1BossHPBar) { fa1BossHPBar.destroy(); fa1BossHPBar = null; }

    game.add.tween(fa1Music)
        .to({ volume: 0 }, 1000, Phaser.Easing.Linear.None, true)
        .onComplete.add(() => {
            fa1Music.stop();
            game.state.start('firstAct');
        });
}

// Voz

function setupFa1Voice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    function startSession() {
        if (game.state.current !== 'firstAct') return;

        const rec = new SpeechRecognition();
        rec.lang = 'es-PE';
        rec.continuous = false;
        rec.interimResults = false;

        rec.onresult = (e) => {
            const txt = e.results[0][0].transcript.toLowerCase().trim();
            if (txt.includes('pausa')) { pauseFa1(); return; }
            if (txt.includes('continuar')) { resumeFa1(); return; }
            if ((txt.includes('fuego') || txt.includes('dispara')) && !fa1PlayerBulletActive && !fa1Dead && !fa1Paused) {
                fireFa1PlayerBullet();
            }
        };

        rec.onerror = (ev) => {
            const delay = (ev.error === 'no-speech' || ev.error === 'aborted') ? 200 : 400;
            setTimeout(startSession, delay);
        };

        rec.onend = () => { setTimeout(startSession, 200); };

        try { rec.start(); } catch (e) { setTimeout(startSession, 300); }
    }

    startSession();
}
