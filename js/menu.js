// Variable global de dificultad — la leen firstAct.js y secondAct.js
window.gameDifficulty = 'normal';

let menuMusic;

// Estado interno del menú
let menuActiveScreen = 'main';
let menuMainElements   = [];
let menuDifficultyElements = [];
let menuSettingsElements    = [];
let menuOceanBg = null;
let menuOverlay = null;
let menuShip = null;
let menuShipBaseY = 0;
let menuMusicVolume = 0.15;
let menuSfxVolume   = 0.5;

let menuEnemyShips   = [];
let menuEsmeraldaShip = null;

function menuClearAll() {
    menuMainElements.forEach(e => e.destroy());
    menuDifficultyElements.forEach(e => e.destroy());
    menuSettingsElements.forEach(e => e.destroy());
    menuMainElements = [];
    menuDifficultyElements = [];
    menuSettingsElements = [];
}

function menuCreateButton(x, y, text, callback) {
    let btn = game.add.text(x, y, text, {
        font: 'bold 32px monospace',
        fill: '#ffffff',
        align: 'center'
    });
    btn.anchor.setTo(0.5);
    btn.inputEnabled = true;
    btn.input.useHandCursor = true;

    btn.events.onInputOver.add(() => { btn.fill = '#c8a94a'; });
    btn.events.onInputOut.add(()  => { btn.fill = '#ffffff'; });
    btn.events.onInputDown.add(callback);

    return btn;
}

function menuShowMainScreen() {
    menuActiveScreen = 'main';
    menuClearAll();

    // Título
    let title = game.add.text(1717 / 2, 120, 'CRÓNICAS DEL CABALLERO \nDE LOS MARES', {
        font: 'bold 64px Georgia',
        fill: '#c8a94a',
        align: 'center'
    });
    title.anchor.setTo(0.5);
    menuMainElements.push(title);

    // Subtítulo
    let sub = game.add.text(1717 / 2, 220, 'David Saavedra | Nicole Nacavilca | Abish Parraga | José Ñiquen', {
        font: 'italic 28px Georgia',
        fill: '#aaaaaa',
        align: 'center'
    });
    sub.anchor.setTo(0.5);
    menuMainElements.push(sub);

    // Botón Iniciar Juego
    let startBtn = menuCreateButton(1717 / 2, 420, 'INICIAR JUEGO', () => {
        menuShowDifficultyScreen();
    });
    menuMainElements.push(startBtn);

    // Botón Configuración
    let configBtn = menuCreateButton(1717 / 2, 510, 'CONFIGURACIÓN', () => {
        menuShowSettingsScreen();
    });
    menuMainElements.push(configBtn);
}

function menuShowDifficultyScreen() {
    menuActiveScreen = 'difficulty';
    menuClearAll();

    // Título
    let title = game.add.text(1717 / 2, 120, 'ELIGE DIFICULTAD', {
        font: 'bold 48px Georgia',
        fill: '#c8a94a',
        align: 'center'
    });
    title.anchor.setTo(0.5);
    menuDifficultyElements.push(title);

    // Opciones alineadas a la izquierda
    const difficulties = [
        { label: 'FÁCIL',   value: 'facil',   desc: 'Oleadas lentas, poco daño' },
        { label: 'NORMAL',  value: 'normal',  desc: 'Experiencia equilibrada'   },
        { label: 'DIFÍCIL', value: 'dificil', desc: 'Oleadas agresivas, mucho daño' },
    ];

    difficulties.forEach((d, i) => {
        let y = 300 + i * 90;

        let btn = menuCreateButton(400, y, d.label, () => {
            menuStartGame(d.value);
        });
        menuDifficultyElements.push(btn);

        let desc = game.add.text(580, y + 2, d.desc, {
            font: '18px Nunito',
            fill: '#888888'
        });
        desc.anchor.setTo(0, 0.5);
        menuDifficultyElements.push(desc);
    });

    // Botón Volver
    let backBtn = menuCreateButton(1717 / 2, 680, 'VOLVER', () => {
        menuShowMainScreen();
    });
    menuDifficultyElements.push(backBtn);
}

function menuShowSettingsScreen() {
    menuActiveScreen = 'settings';
    menuClearAll();

    // Título
    let title = game.add.text(1717 / 2, 120, 'CONFIGURACIÓN', {
        font: 'bold 48px Georgia',
        fill: '#c8a94a',
        align: 'center'
    });
    title.anchor.setTo(0.5);
    menuSettingsElements.push(title);

    // ── Música ──
    let musicLabel = game.add.text(1717 / 2 - 200, 300, 'MÚSICA', {
        font: 'bold 30px monospace',
        fill: '#ffffff'
    });
    musicLabel.anchor.setTo(1, 0.5);
    menuSettingsElements.push(musicLabel);

    let musicDown = menuCreateButton(1717 / 2 + 30, 300, '-', () => {
        menuMusicVolume = Math.max(0, +(menuMusicVolume - 0.1).toFixed(1));
        musicVal.setText(Math.round(menuMusicVolume * 100) + '%');
    });
    menuSettingsElements.push(musicDown);

    let musicVal = game.add.text(1717 / 2 + 100, 300, Math.round(menuMusicVolume * 100) + '%', {
        font: '28px monospace',
        fill: '#c8a94a'
    });
    musicVal.anchor.setTo(0, 0.5);
    menuSettingsElements.push(musicVal);

    let musicUp = menuCreateButton(1717 / 2 + 190, 300, '+', () => {
        menuMusicVolume = Math.min(1, +(menuMusicVolume + 0.1).toFixed(1));
        musicVal.setText(Math.round(menuMusicVolume * 100) + '%');
    });
    menuSettingsElements.push(musicUp);

    // ── Efectos ──
    let sfxLabel = game.add.text(1717 / 2 - 200, 400, 'EFECTOS', {
        font: 'bold 30px monospace',
        fill: '#ffffff'
    });
    sfxLabel.anchor.setTo(1, 0.5);
    menuSettingsElements.push(sfxLabel);

    let sfxDown = menuCreateButton(1717 / 2 + 30, 400, '-', () => {
        menuSfxVolume = Math.max(0, +(menuSfxVolume - 0.1).toFixed(1));
        sfxVal.setText(Math.round(menuSfxVolume * 100) + '%');
    });
    menuSettingsElements.push(sfxDown);

    let sfxVal = game.add.text(1717 / 2 + 100, 400, Math.round(menuSfxVolume * 100) + '%', {
        font: '28px monospace',
        fill: '#c8a94a'
    });
    sfxVal.anchor.setTo(0, 0.5);
    menuSettingsElements.push(sfxVal);

    let sfxUp = menuCreateButton(1717 / 2 + 190, 400, '+', () => {
        menuSfxVolume = Math.min(1, +(menuSfxVolume + 0.1).toFixed(1));
        sfxVal.setText(Math.round(menuSfxVolume * 100) + '%');
    });
    menuSettingsElements.push(sfxUp);

    // Botón Volver
    let backBtn = menuCreateButton(1717 / 2, 580, 'VOLVER', () => {
        menuShowMainScreen();
    });
    menuSettingsElements.push(backBtn);
}

function menuStartGame(difficulty) {
    window.gameDifficulty = difficulty;
    if (menuMusic && menuMusic.isPlaying) menuMusic.stop();
    game.state.start('intro');
}

function setupMenuVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    function startSession() {
        if (game.state.current !== 'menu') return;

        const rec = new SpeechRecognition();
        rec.lang = 'es-PE';
        rec.continuous = false;
        rec.interimResults = false;

        rec.onresult = (ev) => {
            const txt = ev.results[0][0].transcript.toLowerCase().trim();

            if (menuActiveScreen === 'main') {
                if (txt.includes('iniciar') || txt.includes('jugar')) { menuShowDifficultyScreen(); return; }
                if (txt.includes('configur')) { menuShowSettingsScreen(); return; }
            }

            if (menuActiveScreen === 'difficulty') {
                if (txt.includes('fácil') || txt.includes('facil'))    { menuStartGame('facil');   return; }
                if (txt.includes('normal'))                             { menuStartGame('normal');  return; }
                if (txt.includes('difícil') || txt.includes('dificil')) { menuStartGame('dificil'); return; }
                if (txt.includes('volver')) { menuShowMainScreen(); return; }
            }

            if (menuActiveScreen === 'settings') {
                if (txt.includes('volver')) { menuShowMainScreen(); return; }
                const musicWord  = txt.includes('música') || txt.includes('musica');
                const efectoWord = txt.includes('efecto');
                const up   = txt.includes('subir') || txt.includes('más') || txt.includes('mas');
                const down = txt.includes('bajar') || txt.includes('menos');
                if (musicWord && up)   { menuMusicVolume = Math.min(1, +(menuMusicVolume + 0.1).toFixed(1)); if (typeof bgMusic !== 'undefined' && bgMusic) bgMusic.volume = menuMusicVolume; menuShowSettingsScreen(); return; }
                if (musicWord && down) { menuMusicVolume = Math.max(0, +(menuMusicVolume - 0.1).toFixed(1)); if (typeof bgMusic !== 'undefined' && bgMusic) bgMusic.volume = menuMusicVolume; menuShowSettingsScreen(); return; }
                if (efectoWord && up)   { menuSfxVolume = Math.min(1, +(menuSfxVolume + 0.1).toFixed(1)); menuShowSettingsScreen(); return; }
                if (efectoWord && down) { menuSfxVolume = Math.max(0, +(menuSfxVolume - 0.1).toFixed(1)); menuShowSettingsScreen(); return; }
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

let menuState = {
    preload: () => {
        game.load.image('menuOcean',      'img/fondo/ocean-background-3.png');
        game.load.spritesheet('menuHuascar',   'img/personaje-principal/barco/huascar_sprite_sheet.png', 360, 360);
        game.load.spritesheet('menuChileno',   'img/enemigos/sprite_sheet_barco_chileno-2.png', 690, 576);
        game.load.spritesheet('menuEsmeralda', 'img/enemigos/esmeralda-sprite-sheet.png', 384, 192);
        game.load.audio('menuMusic', 'audio/menu-background-sound.mp3');
    },

    create: () => {
        setupMenuVoice();
        menuMusic = game.add.audio('menuMusic');
        menuMusic.loop = true;
        menuMusic.volume = 1;
        menuMusic.play();
        
        // Ocultar HUDs
        let hud1 = document.getElementById('grau-face');
        if (hud1) hud1.style.display = 'none';
        let hud2 = document.getElementById('hud-main2');
        if (hud2) hud2.style.display = 'none';
        if (typeof hudInGame !== 'undefined') hudInGame.style.display = 'none';

        // 1. Fondo océano en loop
        menuOceanBg = game.add.tileSprite(0, 0, 1717, 916, 'menuOcean');
        menuOceanBg.autoScroll(-15, 0);

        menuEnemyShips = [];
        const enemyLanes = [
            { x: 1717 + 100,  y: 680, speed: 1.4, scale: 0.85 },
            { x: 1717 + 600,  y: 820, speed: 1.7, scale: 1.0  },
            { x: 1717 + 1100, y: 730, speed: 1.2, scale: 0.75 },
        ];
        enemyLanes.forEach(cfg => {
            let s = game.add.sprite(cfg.x, cfg.y, 'menuChileno');
            s.anchor.setTo(0.5);
            s.scale.x = -1;
            s.width  = Math.round(300 * cfg.scale);
            s.height = Math.round(250 * cfg.scale);
            s.animations.add('move', [0, 1, 2, 3], 6, true);
            s.animations.play('move');
            s._menuSpeed = cfg.speed;
            menuEnemyShips.push(s);
        });

        // Esmeralda — más lenta y grande, entra después
        menuEsmeraldaShip = game.add.sprite(1717 + 800, 750, 'menuEsmeralda');
        menuEsmeraldaShip.anchor.setTo(0.5);
        menuEsmeraldaShip.scale.x = -1;
        menuEsmeraldaShip.width  = 500;
        menuEsmeraldaShip.height = 250;
        menuEsmeraldaShip.animations.add('move', [0, 1, 2, 3, 4], 6, true);
        menuEsmeraldaShip.animations.play('move');

        // 2b. Barco del jugador (Huáscar) — decorativo en zona inferior
        menuShip = game.add.sprite(1717 / 2, 320, 'menuHuascar');
        menuShip.anchor.setTo(0.5);
        menuShip.scale.x = -1;
        menuShip.width = 200;
        menuShip.height = 200;
        menuShip.frame = 1;
        menuShip.animations.add('right', [0, 1, 2, 3], 8, true);
        menuShip.animations.play('right');
        menuShipBaseY = 320;

        // 3. Overlay negro semitransparente
        menuOverlay = game.add.graphics();
        menuOverlay.beginFill(0x000000, 0.5);
        menuOverlay.drawRect(0, 0, 1717, 916);
        menuOverlay.endFill();

        // 4. Pantalla principal
        menuShowMainScreen();
    },

    update: () => {
        // Barco del jugador: balanceo sinusoidal
        if (menuShip) {
            menuShip.y = menuShipBaseY + Math.sin(game.time.now * 0.001) * 20;
        }

        // Barcos chilenos: avanzan hacia la izquierda y hacen wrap
        menuEnemyShips.forEach(s => {
            s.x -= s._menuSpeed;
            if (s.x < -(s.width / 2 + 50)) {
                s.x = 1717 + Phaser.Math.between(50, 500);
                s.y = Phaser.Math.between(640, 840);
            }
        });

        // Esmeralda: más lenta
        if (menuEsmeraldaShip) {
            menuEsmeraldaShip.x -= 0.7;
            if (menuEsmeraldaShip.x < -300) {
                menuEsmeraldaShip.x = 1717 + Phaser.Math.between(100, 400);
                menuEsmeraldaShip.y = Phaser.Math.between(650, 820);
            }
        }
    }
};
