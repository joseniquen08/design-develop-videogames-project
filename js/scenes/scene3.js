let scene3DialogIndex = 0;
let scene3IsTyping = false;
let scene3CurrentText = '';
let scene3TypewriterTimer = null;
let scene3TypingIndex = 0;
let scene3ActiveTextObj = null;
let scene3CharacterName, scene3DialogText, scene3AlertText, scene3ContinueHint, scene3EnterKey;
let scene3TextBlip, scene3BoomSound, scene3WaveSound;
let scene3DialogBox, scene3DialogGroup, scene3AlertBox;
let scene3Background, scene3BackgroundMoving = false;
let scene3Music;
let scene3BattleStarted = false;
let scene3MusicStarted = false;
let scene3AlertShown = false;
let scene3Huascar, scene3GrauSprite;

const scene3Dialogues = [
    { character: 'GRAU', text: 'Rumbo a Antofagasta... el mar está demasiado tranquilo hoy.', type: 'normal' },
    { character: 'GRAU', text: 'Algo no está bien... no veo ninguna embarcación en el horizonte.', type: 'normal' },
    { character: 'GRAU', text: '...', type: 'boom' },
    { character: '', text: '¡Una flota chilena se aproxima por el norte! ¡Prepárate, Almirante!', type: 'alert' },
    { character: 'GRAU', text: 'Nos superan en número y en fuego... pero no en honor ni en valentía.', type: 'normal' },
    { character: 'GRAU', text: '¡Tripulación, a sus puestos! ¡Por el Perú y por la gloria!', type: 'normal' },
];

let scene3State = {
    preload: () => {
        game.load.image('bg-scene3', 'img/fondo/ocean-background-3.png');
        game.load.spritesheet('huascar-scene3', 'img/personaje-principal/barco/huascar_sprite_sheet.png', 360, 360);
        game.load.spritesheet('grau-scene3', 'img/escenas/sprite-grau.png', 384, 384);
        game.load.audio('scene3Music', 'audio/final-act-background-1.m4a');
        game.load.audio('boomSound', 'audio/boom-sound-effect.mp3');
        game.load.audio('waveSound', 'audio/wave-sound-effect.mp3');
        game.load.audio('textSound', 'audio/text-digit-sound.mp3');
    },

    create: () => {
        hudInGame.style.display = "none";

        scene3DialogIndex = 0;
        scene3IsTyping = false;
        scene3BattleStarted = false;
        scene3BackgroundMoving = false;
        scene3MusicStarted = false;
        scene3AlertShown = false;

        // La música arranca DESPUÉS del alert, no al inicio de la escena
        scene3Music = game.add.audio('scene3Music');
        scene3Music.loop = true;
        scene3Music.volume = 0.5 * menuMusicVolume;

        scene3TextBlip = game.add.audio('textSound');
        scene3TextBlip.volume = 0.8 * menuSfxVolume;
        scene3TextBlip.loop = true;

        scene3BoomSound = game.add.audio('boomSound');
        scene3BoomSound.volume = 0.9 * menuSfxVolume;

        scene3WaveSound = game.add.audio('waveSound');
        scene3WaveSound.volume = 0.8 * menuSfxVolume;

        // Fondo oceánico
        scene3Background = game.add.tileSprite(0, 0, 1717, 916, 'bg-scene3');

        // Overlay oscuro semitransparente (igual que scene1)
        let overlay = game.add.graphics();
        overlay.beginFill(0x000000, 0.5);
        overlay.drawRect(0, 0, 1717, 916);
        overlay.endFill();

        // Huáscar empieza fuera de pantalla (se añade antes que Grau → queda detrás)
        scene3Huascar = game.add.sprite(-400, 916 * 0.55, 'huascar-scene3');
        scene3Huascar.anchor.setTo(0.5);
        scene3Huascar.scale.x = -1;
        scene3Huascar.animations.add('sail', [0, 1, 2, 3], 4, true);
        scene3Huascar.animations.play('sail');

        // Sprite de Grau — se añade DESPUÉS del Huáscar para quedar encima
        scene3GrauSprite = game.add.sprite(80, 916 - 500 - 190, 'grau-scene3');
        scene3GrauSprite.anchor.setTo(0, 0);
        scene3GrauSprite.width = 450;
        scene3GrauSprite.height = 450;
        scene3GrauSprite.alpha = 0;
        scene3GrauSprite.animations.add('blink', [0, 1, 2, 3, 2, 1, 0], 8, false);

        // Grupo de diálogo normal (caja inferior)
        scene3DialogGroup = game.add.group();
        scene3DialogGroup.visible = false;

        scene3DialogBox = game.add.graphics();
        scene3DialogBox.beginFill(0x000000, 0.75);
        scene3DialogBox.drawRoundedRect(60, 680, 1600, 200, 12);
        scene3DialogBox.endFill();
        scene3DialogBox.lineStyle(2, 0x4af0ff, 1);
        scene3DialogBox.drawRoundedRect(60, 680, 1600, 200, 12);
        scene3DialogGroup.add(scene3DialogBox);

        scene3CharacterName = game.add.text(100, 695, '', {
            font: '28px monospace',
            fill: '#4af0ff',
            fontWeight: 'bold'
        });
        scene3DialogGroup.add(scene3CharacterName);

        scene3DialogText = game.add.text(100, 740, '', {
            font: '22px monospace',
            fill: '#ffffff',
            wordWrap: true,
            wordWrapWidth: 1520
        });
        scene3DialogGroup.add(scene3DialogText);

        // Hint fuera del grupo para que sea visible en ambos modos
        scene3ContinueHint = game.add.text(1580, 830, '▶', {
            font: '22px monospace',
            fill: '#daa520'
        });
        scene3ContinueHint.alpha = 0;
        game.add.tween(scene3ContinueHint)
            .to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);

        // Caja negra detrás del texto de alerta
        scene3AlertBox = game.add.graphics();
        scene3AlertBox.beginFill(0x000000, 0.75);
        scene3AlertBox.drawRoundedRect(140, 360, 1440, 200, 12);
        scene3AlertBox.endFill();
        scene3AlertBox.lineStyle(2, 0xff2222, 1);
        scene3AlertBox.drawRoundedRect(140, 360, 1440, 200, 12);
        scene3AlertBox.visible = false;

        // Texto de alerta (centrado, grande, rojo — para el diálogo tipo 'alert')
        scene3AlertText = game.add.text(1717 / 2, 916 / 2, '', {
            font: 'bold 44px monospace',
            fill: '#ff2222',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 1400
        });
        scene3AlertText.anchor.setTo(0.5);
        scene3AlertText.visible = false;

        // Input
        scene3EnterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        game.input.onDown.add(advanceScene3Dialogue);

        // Animación de entrada del Huáscar
        game.add.tween(scene3Huascar)
            .to({ x: 600 }, 2000, Phaser.Easing.Quadratic.Out, true)
            .onComplete.add(() => {
                scene3BackgroundMoving = true;
                scene3DialogGroup.visible = true;
                // Grau aparece junto con la caja de diálogo (el tween de vuelta
                // post-alert lo maneja showScene3Dialogue; aquí solo el fade inicial)
                game.add.tween(scene3GrauSprite).to({ alpha: 1 }, 800, Phaser.Easing.Linear.None, true);
                game.time.events.loop(3000, () => {
                    if (scene3GrauSprite.alpha > 0.5) scene3GrauSprite.animations.play('blink');
                });
                game.time.events.add(500, () => showScene3Dialogue(0));
            });
    },

    update: () => {
        if (scene3BackgroundMoving) {
            scene3Background.tilePosition.x += 2;
        }
        if (scene3EnterKey.justDown) {
            advanceScene3Dialogue();
        }
    }
};

function showScene3Dialogue(index) {
    if (index >= scene3Dialogues.length) {
        if (scene3BattleStarted) return;
        scene3BattleStarted = true;
        startScene3Transition();
        return;
    }

    const d = scene3Dialogues[index];

    if (d.type === 'boom') {
        scene3BoomSound.play();
        scene3BackgroundMoving = false;
        game.time.events.add(1000, () => { scene3BackgroundMoving = true; });
    }

    if (d.type === 'alert') {
        // Ocultar Grau durante el mensaje de alerta
        scene3AlertShown = true;
        game.add.tween(scene3GrauSprite).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
        scene3DialogGroup.visible = false;
        scene3AlertBox.visible = true;
        scene3AlertText.visible = true;
        scene3AlertText.setText('');
        scene3ActiveTextObj = scene3AlertText;
        scene3WaveSound.play();
    } else {
        // Solo arranca la música al primer diálogo normal DESPUÉS del alert
        if (!scene3MusicStarted && scene3AlertShown) {
            scene3MusicStarted = true;
            scene3Music.play();
            game.add.tween(scene3GrauSprite).to({ alpha: 1 }, 600, Phaser.Easing.Linear.None, true);
        }
        scene3DialogGroup.visible = true;
        scene3AlertBox.visible = false;
        scene3AlertText.visible = false;
        scene3CharacterName.setText(d.character);
        scene3DialogText.setText('');
        scene3ActiveTextObj = scene3DialogText;
    }

    scene3CurrentText = d.text;
    scene3IsTyping = true;
    scene3TypingIndex = 0;

    scene3TextBlip.play();
    game.time.events.add(scene3CurrentText.length * 40, () => {
        if (scene3TextBlip.isPlaying) scene3TextBlip.stop();
    });

    scene3TypewriterTimer = game.time.events.loop(40, () => {
        if (scene3TypingIndex < scene3CurrentText.length) {
            scene3ActiveTextObj.setText(scene3CurrentText.substring(0, scene3TypingIndex + 1));
            scene3TypingIndex++;
        } else {
            scene3IsTyping = false;
            game.time.events.remove(scene3TypewriterTimer);
            if (scene3TextBlip.isPlaying) scene3TextBlip.stop();
        }
    });
}

function advanceScene3Dialogue() {
    if (scene3BattleStarted) return;
    if (scene3IsTyping) {
        scene3IsTyping = false;
        game.time.events.remove(scene3TypewriterTimer);
        if (scene3TextBlip.isPlaying) scene3TextBlip.stop();
        scene3ActiveTextObj.setText(scene3CurrentText);
        scene3TypingIndex = scene3CurrentText.length;
        return;
    }
    scene3DialogIndex++;
    showScene3Dialogue(scene3DialogIndex);
}

function startScene3Transition() {
    game.input.onDown.remove(advanceScene3Dialogue);

    // Fade out music → flash blanco → main2 (en secuencia para garantizar que
    // la música para antes de cambiar de state; Phaser CE no detiene audio automáticamente)
    game.add.tween(scene3Music)
        .to({ volume: 0 }, 800, Phaser.Easing.Linear.None, true)
        .onComplete.add(() => {
            scene3Music.stop();

            let flash = game.add.graphics();
            flash.beginFill(0xffffff, 1);
            flash.drawRect(0, 0, 1717, 916);
            flash.endFill();
            flash.alpha = 0;

            game.add.tween(flash)
                .to({ alpha: 0.8 }, 200, Phaser.Easing.Linear.None, true)
                .onComplete.add(() => {
                    game.add.tween(flash)
                        .to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true)
                        .onComplete.add(() => game.state.start('secondAct'));
                });
        });
}

function setupScene3Voice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    function startSession() {
        if (game.state.current !== 'scene3') return;

        const rec = new SpeechRecognition();
        rec.lang = 'es-PE';
        rec.continuous = false;
        rec.interimResults = false;

        rec.onresult = (e) => {
            const txt = e.results[0][0].transcript.toLowerCase().trim();
            if (txt.includes('continuar') || txt.includes('siguiente')) {
                advanceScene3Dialogue();
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
