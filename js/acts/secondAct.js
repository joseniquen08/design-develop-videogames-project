// Configuración de oleadas
let waveEnemyCount = 3;
let waveEnemySpeed = 80;
let waveEnemyFireRate = 2500;
const waveDifficulty = 1.15;

let main2Background;
let main2Player;
let main2PlayerBullet;
let main2PlayerBulletActive = false;
let main2Enemies;
let main2EnemyBullets;
let main2HP = 100;
const main2MaxHP = 100;
let main2Music;
let main2Wave = 1;
let main2Dead = false;
let main2EnemiesInWave = 0;
let main2PlayerInvincible = false;

let main2RightKey, main2LeftKey, main2UpKey, main2DownKey, main2SpaceKey;
let main2WKey, main2AKey, main2SKey, main2DKey;

let main2State = {
    preload: () => {
        game.load.image('bg-main2', 'img/fondo/ocean-background-3.png');
        game.load.spritesheet('player-main2', 'img/personaje-principal/barco/huascar_sprite_sheet.png', 360, 360);
        game.load.spritesheet('enemy-main2', 'img/enemigos/sprite_sheet_barco_chileno-2.png', 690, 576);
        game.load.audio('bgMusic2', 'audio/final-act-background-2.m4a');
    },

    create: () => {
        // Reiniciar estado de oleadas
        const diff = window.DIFFICULTY_SETTINGS[window.gameDifficulty || 'normal'];
        waveEnemyCount = 3;
        waveEnemySpeed = Math.round(80 * diff.speedMult);
        waveEnemyFireRate = Math.round(2500 * diff.fireRateMult);
        main2Wave = 1;
        main2HP = 100;
        main2Dead = false;
        main2EnemiesInWave = 0;
        main2PlayerBulletActive = false;
        main2PlayerInvincible = false;

        let hud = document.getElementById('hud-main2');
        if (hud) hud.style.display = 'flex';
        updateMain2HUD();

        main2Music = game.add.audio('bgMusic2');
        main2Music.loop = true;
        main2Music.volume = 0.6;
        main2Music.play();

        main2Background = game.add.tileSprite(0, 0, 1717, 916, 'bg-main2');

        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Huáscar (jugador)
        main2Player = game.add.sprite(200, 916 / 2, 'player-main2');
        main2Player.anchor.setTo(0.5);
        main2Player.scale.x = -1;
        main2Player.frame = 1;
        main2Player.animations.add('right', [0, 1, 2, 3], 8, true);
        game.physics.arcade.enable(main2Player);

        // Textura bala del jugador (círculo blanco)
        let pBD = game.make.bitmapData(20, 20);
        pBD.ctx.beginPath();
        pBD.ctx.arc(10, 10, 10, 0, Math.PI * 2);
        pBD.ctx.fillStyle = '#ffffff';
        pBD.ctx.fill();
        main2PlayerBullet = game.add.sprite(-200, -200, pBD);
        main2PlayerBullet.anchor.setTo(0.5);
        main2PlayerBullet.exists = false;
        game.physics.arcade.enable(main2PlayerBullet);

        // Textura bala enemiga (círculo rojo)
        let eBD = game.make.bitmapData(16, 16);
        eBD.ctx.beginPath();
        eBD.ctx.arc(8, 8, 8, 0, Math.PI * 2);
        eBD.ctx.fillStyle = '#ff3333';
        eBD.ctx.fill();

        // Pool de balas enemigas
        main2EnemyBullets = game.add.group();
        for (let i = 0; i < 40; i++) {
            let b = game.add.sprite(-200, -200, eBD);
            b.anchor.setTo(0.5);
            b.exists = false;
            game.physics.arcade.enable(b);
            main2EnemyBullets.add(b);
        }

        // Grupo de enemigos con física
        main2Enemies = game.add.group();
        main2Enemies.enableBody = true;
        main2Enemies.physicsBodyType = Phaser.Physics.ARCADE;

        // Input
        main2RightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        main2LeftKey  = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        main2UpKey    = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        main2DownKey  = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        main2SpaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        main2WKey     = game.input.keyboard.addKey(Phaser.Keyboard.W);
        main2AKey     = game.input.keyboard.addKey(Phaser.Keyboard.A);
        main2SKey     = game.input.keyboard.addKey(Phaser.Keyboard.S);
        main2DKey     = game.input.keyboard.addKey(Phaser.Keyboard.D);

        setupMain2Voice();
        spawnWave2();
    },

    update: () => {
        if (main2Dead) return;

        main2Background.tilePosition.x -= 1;

        // Movimiento del jugador
        if (main2RightKey.isDown || main2DKey.isDown) {
            main2Player.x += 2;
            main2Player.animations.play('right');
            main2Player.scale.x = -1;
        } else if ((main2LeftKey.isDown || main2AKey.isDown)  && main2Player.x > 170 ) {
            main2Player.x -= 2;
            main2Player.scale.x = 1;
        } else if ((main2UpKey.isDown || main2WKey.isDown) && main2Player.y > 130 ) {
            main2Player.y -= 2;
        } else if ((main2DownKey.isDown || main2SKey.isDown) && main2Player.y < 830) {
            main2Player.y += 2;
        }

        main2Player.x = Phaser.Math.clamp(main2Player.x, 0, 800);
        main2Player.y = Phaser.Math.clamp(main2Player.y, 0, 916);

        // Disparo del jugador
        if (main2SpaceKey.justDown && !main2PlayerBulletActive) {
            fireMain2PlayerBullet();
        }

        // Bala del jugador fuera de pantalla
        if (main2PlayerBulletActive && main2PlayerBullet.x > 1800) {
            main2PlayerBullet.exists = false;
            main2PlayerBulletActive = false;
        }

        // Actualizar enemigos
        main2Enemies.forEachAlive((e) => {
            e.fireTimer -= game.time.elapsed;
            if (e.fireTimer <= 0) {
                e.fireTimer = waveEnemyFireRate + Phaser.Math.between(-300, 300);
                fireMain2EnemyBullet(e);
            }
            // Colisión cuerpo a cuerpo manual (evita bugs de arcade.overlap con el jugador)
            if (!main2PlayerInvincible) {
                let dx = e.x - main2Player.x;
                let dy = e.y - main2Player.y;
                if (dx * dx + dy * dy < 120 * 120) {
                    e.kill();
                    takeDamage2(35);
                }
            }
            if (e.x < -250) e.kill();
        });

        // Balas enemigas: fuera de pantalla + colisión manual con el jugador
        main2EnemyBullets.forEachExists((b) => {
            if (b.x < -60 || b.x > 1800 || b.y < -60 || b.y > 980) {
                b.kill();
                return;
            }
            if (!main2PlayerInvincible) {
                let dx = b.x - main2Player.x;
                let dy = b.y - main2Player.y;
                if (dx * dx + dy * dy < 60 * 60) {
                    b.kill();
                    takeDamage2(25);
                }
            }
        });

        // Bala jugador vs enemigos (physics overlap es seguro aquí: no involucra al jugador)
        game.physics.arcade.overlap(main2PlayerBullet, main2Enemies, (pBullet, e) => {
            pBullet.exists = false;
            main2PlayerBulletActive = false;
            e.kill();
        });

        // Fin de oleada
        if (main2EnemiesInWave > 0 && main2Enemies.countLiving() === 0) {
            main2EnemiesInWave = 0;
            game.time.events.add(1500, nextWave2);
        }
    }
};

function spawnWave2() {
    main2EnemiesInWave = Math.floor(waveEnemyCount);

    for (let i = 0; i < main2EnemiesInWave; i++) {
        let yPos = (916 / (main2EnemiesInWave + 1)) * (i + 1);
        let xPos = 1717 + i * 200;
        let e = main2Enemies.create(xPos, yPos, 'enemy-main2');
        e.anchor.setTo(0.5);
        e.scale.x = -1;
        e.width = 300; e.height = 250;
        e.animations.add('move', [0, 1, 2, 3], 6, true);
        e.animations.play('move');
        e.body.velocity.x = -waveEnemySpeed;
        e.fireTimer = waveEnemyFireRate + Phaser.Math.between(0, 1500);
    }

    let waveEl = document.getElementById('wave-counter');
    if (waveEl) waveEl.textContent = 'Oleada ' + main2Wave;
}

function nextWave2() {
    if (main2Dead) return;
    main2Wave++;
    waveEnemyCount += 1;
    waveEnemySpeed *= waveDifficulty;
    waveEnemyFireRate = Math.max(800, waveEnemyFireRate * 0.9);
    spawnWave2();
}

function fireMain2PlayerBullet() {
    main2PlayerBulletActive = true;
    main2PlayerBullet.reset(main2Player.x + 120, main2Player.y);
    main2PlayerBullet.body.velocity.x = 600;
    main2PlayerBullet.body.velocity.y = 0;
    main2PlayerBullet.exists = true;
}

function fireMain2EnemyBullet(enemy) {
    if (main2Dead || !enemy.alive) return;
    let b = main2EnemyBullets.getFirstExists(false);
    if (!b) return;
    b.reset(enemy.x - 30, enemy.y);
    let dx = main2Player.x - enemy.x;
    let dy = main2Player.y - enemy.y;
    let dist = Math.sqrt(dx * dx + dy * dy) || 1;
    let speed = 280;
    b.body.velocity.x = (dx / dist) * speed;
    b.body.velocity.y = (dy / dist) * speed;
    b.exists = true;
}

function takeDamage2(amount) {
    if (main2Dead || main2PlayerInvincible) return;

    main2HP = Math.max(0, main2HP - amount);
    updateMain2HUD();

    // Asegurar que el sprite siga visible (por si physics lo ocultó)
    main2Player.exists = true;
    main2Player.alive = true;
    main2Player.visible = true;

    // Tinte rojo durante 1 segundo + período de invencibilidad
    main2Player.tint = 0xff4444;
    main2PlayerInvincible = true;
    game.time.events.add(1000, () => {
        if (main2Player) main2Player.tint = 0xffffff;
        main2PlayerInvincible = false;
    });

    game.camera.shake(0.015, 300);

    // Flash rojo en pantalla
    let flash = game.add.graphics();
    flash.beginFill(0xff0000, 0.5);
    flash.drawRect(0, 0, 1717, 916);
    flash.endFill();
    game.add.tween(flash)
        .to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true)
        .onComplete.add(() => flash.destroy());

    if (main2HP <= 0) gameOver2();
}

function updateMain2HUD() {
    let face = document.getElementById('grau-face-2');
    if (face) {
        if (main2HP > 50) {
            face.src = 'img/personaje-principal/cara/sprite-miguel-grau-normal.png';
        } else if (main2HP > 25) {
            face.src = 'img/personaje-principal/cara/sprite-miguel-grau-herido-50.png';
        } else {
            face.src = 'img/personaje-principal/cara/sprite-miguel-grau-herido-80.png';
        }
    }
    let hpBar = document.getElementById('hp-bar');
    if (hpBar) hpBar.style.width = (main2HP / main2MaxHP * 100) + '%';
}

function gameOver2() {
    main2Dead = true;
    main2Enemies.setAll('body.velocity.x', 0);
    main2Enemies.setAll('body.velocity.y', 0);
    main2EnemyBullets.callAll('kill', null);

    // Red de seguridad: scene3Music puede seguir corriendo si el state cambió
    // antes de que su tween de fade terminara (Phaser CE no detiene audio al cambiar state)
    if (typeof scene3Music !== 'undefined' && scene3Music && scene3Music.isPlaying) {
        scene3Music.stop();
    }

    game.add.tween(main2Music)
        .to({ volume: 0 }, 1000, Phaser.Easing.Linear.None, true)
        .onComplete.add(() => {
            main2Music.stop();
            let hud = document.getElementById('hud-main2');
            if (hud) hud.style.display = 'none';
            game.state.start('ending');
        });
}

function setupMain2Voice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    function startSession() {
        if (game.state.current !== 'main2') return;

        const rec = new SpeechRecognition();
        rec.lang = 'es-PE';
        rec.continuous = false;
        rec.interimResults = false;

        rec.onresult = (e) => {
            const txt = e.results[0][0].transcript.toLowerCase().trim();
            if ((txt.includes('fuego') || txt.includes('dispara')) && !main2PlayerBulletActive && !main2Dead) {
                fireMain2PlayerBullet();
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
