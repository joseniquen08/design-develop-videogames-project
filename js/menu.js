// Variable global de dificultad — la leen firstAct.js y secondAct.js
window.gameDifficulty = 'normal';

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
    let title = game.add.text(1717 / 2, 120, 'COMBATE NAVAL\nDE ANGAMOS', {
        font: 'bold 64px Georgia',
        fill: '#c8a94a',
        align: 'center'
    });
    title.anchor.setTo(0.5);
    menuMainElements.push(title);

    // Subtítulo
    let sub = game.add.text(1717 / 2, 220, 'El Caballero de los Mares', {
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
            window.gameDifficulty = d.value;
            game.state.start('intro');
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

let menuState = {
    preload: () => {
        game.load.image('menuOcean', 'img/fondo/ocean-background-3.png');
        game.load.spritesheet('menuHuascar', 'img/personaje-principal/barco/huascar_sprite_sheet.png', 360, 360);
    },

    create: () => {
        // Ocultar HUDs
        let hud1 = document.getElementById('grau-face');
        if (hud1) hud1.style.display = 'none';
        let hud2 = document.getElementById('hud-main2');
        if (hud2) hud2.style.display = 'none';
        if (typeof hudInGame !== 'undefined') hudInGame.style.display = 'none';

        // 1. Fondo océano en loop
        menuOceanBg = game.add.tileSprite(0, 0, 1717, 916, 'menuOcean');
        menuOceanBg.autoScroll(-15, 0);

        // 2. Barco decorativo con animación — posicionado debajo de todo el UI
        menuShip = game.add.sprite(1717 / 2, 820, 'menuHuascar');
        menuShip.anchor.setTo(0.5);
        menuShip.scale.x = -1;
        menuShip.width = 200;
        menuShip.height = 200;
        menuShip.frame = 1;
        menuShip.animations.add('right', [0, 1, 2, 3], 8, true);
        menuShip.animations.play('right');
        menuShipBaseY = 820;

        // 3. Overlay negro semitransparente
        menuOverlay = game.add.graphics();
        menuOverlay.beginFill(0x000000, 0.5);
        menuOverlay.drawRect(0, 0, 1717, 916);
        menuOverlay.endFill();

        // 4. Pantalla principal
        menuShowMainScreen();
    },

    update: () => {
        // Barco decorativo: balanceo sinusoidal
        if (menuShip) {
            menuShip.y = menuShipBaseY + Math.sin(game.time.now * 0.001) * 8;
        }
    }
};
