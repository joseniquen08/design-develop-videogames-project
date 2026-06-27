let scene2DialogIndex = 0;
let scene2IsTyping = false;
let scene2CurrentText = '';
let scene2TypewriterTimer = null;
let scene2TypingIndex = 0;
let scene2CharacterName, scene2DialogText, scene2ContinueHint, scene2EnterKey;
let scene2TextBlip;
let scene2DialogGroup;
let scene2SpriteGrau, scene2SpritePrat;
let scene2BattleStarted = false;

const scene2Dialogues = [
    { character: 'PRAT', text: 'Almirante Grau, rinda su nave. No tiene escapatoria.', speaker: 'prat' },
    { character: 'GRAU', text: 'Un marino peruano no se rinde. ¡Prepárense para el combate!', speaker: 'grau' },
    { character: 'PRAT', text: 'Entonces que Dios nos juzgue a ambos.', speaker: 'prat' },
    { character: 'GRAU', text: '¡Al combate, por el Perú!', speaker: 'grau' },
];

let scene2State = {
    preload: () => {
        game.load.audio('textSound', 'audio/text-digit-sound.mp3');
        game.load.image('background-scene2', 'img/fondo/ocean-background-3.png');
        game.load.spritesheet('mainBoat-scene2', 'img/personaje-principal/barco/huascar_sprite_sheet.png', 360, 360);
        game.load.spritesheet('enemyBoat-scene2', 'img/enemigos/sprite_sheet_barco_chileno-2.png', 690, 576);
        game.load.spritesheet('sprite-grau-scene2', 'img/escenas/sprite-grau.png', 384, 384);
        game.load.spritesheet('sprite-prat-scene2', 'img/escenas/arturo-prat-sprite-sheet.png', 896, 896);
    },

    create: () => {
        hudInGame.style.display = "none";

        scene2DialogIndex = 0;
        scene2IsTyping = false;
        scene2BattleStarted = false;

        // Fondo oceánico
        game.add.tileSprite(0, 0, 1717, 916, 'background-scene2');

        // Overlay negro semitransparente para resaltar el diálogo
        let overlay = game.add.graphics();
        overlay.beginFill(0x000000, 0.35);
        overlay.drawRect(0, 0, 1717, 916);
        overlay.endFill();

        scene2TextBlip = game.add.audio('textSound');
        scene2TextBlip.volume = 0.8 * menuSfxVolume;
        scene2TextBlip.loop = true;

        // Sprite Grau — izquierda
        scene2SpriteGrau = game.add.sprite(80, 916 - 500 - 190, 'sprite-grau-scene2');
        scene2SpriteGrau.anchor.setTo(0, 0);
        scene2SpriteGrau.width = 450;
        scene2SpriteGrau.height = 450;
        scene2SpriteGrau.animations.add('blink', [0, 1, 2, 3, 2, 1, 0], 8, false);
        game.time.events.loop(3000, () => scene2SpriteGrau.animations.play('blink'));

        // Sprite Prat — derecha
        scene2SpritePrat = game.add.sprite(1717 - 530, 916 - 500 - 190, 'sprite-prat-scene2');
        scene2SpritePrat.anchor.setTo(0, 0);
        scene2SpritePrat.width = 450;
        scene2SpritePrat.height = 450;
        scene2SpritePrat.alpha = 0;
        scene2SpritePrat.animations.add('blink', [0, 1, 2, 3, 4, 3, 2, 1, 0], 8, false);
        game.time.events.loop(3500, () => {
            if (scene2SpritePrat.alpha > 0) scene2SpritePrat.animations.play('blink');
        });

        // Fade in de Grau al inicio
        game.add.tween(scene2SpriteGrau).from({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);

        // Caja de diálogo (agrupada para poder bajarla al terminar)
        scene2DialogGroup = game.add.group();

        let dialogBox = game.add.graphics();
        dialogBox.beginFill(0x000000, 0.75);
        dialogBox.drawRoundedRect(60, 680, 1600, 200, 12);
        dialogBox.endFill();
        dialogBox.lineStyle(2, 0xdaa520, 1);
        dialogBox.drawRoundedRect(60, 680, 1600, 200, 12);
        scene2DialogGroup.add(dialogBox);

        // Nombre del personaje
        scene2CharacterName = game.add.text(100, 695, '', {
            font: '28px monospace',
            fill: '#daa520',
            fontWeight: 'bold'
        });
        scene2DialogGroup.add(scene2CharacterName);

        // Texto del diálogo
        scene2DialogText = game.add.text(100, 740, '', {
            font: '22px monospace',
            fill: '#ffffff',
            wordWrap: true,
            wordWrapWidth: 1520
        });
        scene2DialogGroup.add(scene2DialogText);

        // Hint continuar
        scene2ContinueHint = game.add.text(1580, 850, '▶', {
            font: '22px monospace',
            fill: '#daa520'
        });
        game.add.tween(scene2ContinueHint)
            .to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
        scene2DialogGroup.add(scene2ContinueHint);

        // Input
        scene2EnterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        game.input.onDown.add(advanceScene2Dialogue);

        game.time.events.add(1500, () => showScene2Dialogue(0));
    },

    update: () => {
        if (scene2EnterKey.justDown) {
            advanceScene2Dialogue();
        }
    }
};

function showScene2Dialogue(index) {
    if (index >= scene2Dialogues.length) {
        if (scene2BattleStarted) return;
        scene2BattleStarted = true;
        startBattleEntrance();
        return;
    }

    const dialogue = scene2Dialogues[index];
    scene2CharacterName.setText(dialogue.character);
    scene2DialogText.setText('');
    scene2IsTyping = true;
    scene2TypingIndex = 0;
    scene2CurrentText = dialogue.text;

    const textDuration = scene2CurrentText.length * 40;

    scene2TextBlip.play();
    game.time.events.add(textDuration, () => {
        if (scene2TextBlip.isPlaying) scene2TextBlip.stop();
    });

    // Mostrar/ocultar sprites según quién habla
    if (dialogue.speaker === 'grau') {
        game.add.tween(scene2SpriteGrau).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true);
        game.add.tween(scene2SpritePrat).to({ alpha: 0.4 }, 400, Phaser.Easing.Linear.None, true);
        scene2CharacterName.fill = '#4af0ff'; // azul para Grau
    } else {
        game.add.tween(scene2SpritePrat).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true);
        game.add.tween(scene2SpriteGrau).to({ alpha: 0.4 }, 400, Phaser.Easing.Linear.None, true);
        scene2CharacterName.fill = '#daa520'; // dorado para Prat

        // Primera vez que habla Prat — fade in
        if (index === 0) {
            scene2SpritePrat.alpha = 0;
            game.add.tween(scene2SpritePrat).to({ alpha: 1 }, 600, Phaser.Easing.Linear.None, true);
        }
    }

    typewriterTimer = game.time.events.loop(40, () => {
        if (scene2TypingIndex < scene2CurrentText.length) {
            scene2DialogText.setText(scene2CurrentText.substring(0, scene2TypingIndex + 1));
            scene2TypingIndex++;
        } else {
            scene2IsTyping = false;
            game.time.events.remove(typewriterTimer);
            if (scene2TextBlip.isPlaying) scene2TextBlip.stop();
        }
    });
}

function advanceScene2Dialogue() {
    if (scene2BattleStarted) return;
    if (scene2IsTyping) {
        scene2IsTyping = false;
        game.time.events.remove(typewriterTimer);
        scene2DialogText.setText(scene2CurrentText);
        scene2TypingIndex = scene2CurrentText.length;
        return;
    }
    scene2DialogIndex++;
    showScene2Dialogue(scene2DialogIndex);
}

function setupScene2Voice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    function startSession() {
        if (game.state.current !== 'scene2') return;

        const rec = new SpeechRecognition();
        rec.lang = 'es-PE';
        rec.continuous = false;
        rec.interimResults = false;

        rec.onresult = (e) => {
            const txt = e.results[0][0].transcript.toLowerCase().trim();
            if (txt.includes('continuar') || txt.includes('siguiente')) {
                advanceScene2Dialogue();
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

function startBattleEntrance() {
    // Baja y desvanece la caja de diálogo junto con los retratos
    game.add.tween(scene2DialogGroup)
        .to({ y: 300, alpha: 0 }, 600, Phaser.Easing.Quadratic.In, true);
    game.add.tween(scene2SpriteGrau).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
    game.add.tween(scene2SpritePrat).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);

    const entranceDuration = 1800;

    // Huáscar entra desde la izquierda hasta su posición de batalla
    let entranceMainBoat = game.add.sprite(-300, BATTLE_POSITIONS.mainBoatY, 'mainBoat-scene2');
    entranceMainBoat.anchor.setTo(0.5);
    entranceMainBoat.scale.x = -1;
    entranceMainBoat.animations.add('right', [0, 1, 2, 3], 8, true);
    entranceMainBoat.animations.play('right');

    game.add.tween(entranceMainBoat)
        .to({ x: BATTLE_POSITIONS.mainBoatX }, entranceDuration, Phaser.Easing.Quadratic.Out, true);

    // El barco chileno entra desde la derecha hasta su posición de batalla
    let entranceEnemy = game.add.sprite(game.width + 300, BATTLE_POSITIONS.enemyY, 'enemyBoat-scene2');
    entranceEnemy.anchor.setTo(0.5);
    entranceEnemy.scale.x = -1;
    entranceEnemy.width = 300; entranceEnemy.height = 250;
    entranceEnemy.animations.add('move', [0, 1, 2, 3], 6, true);
    entranceEnemy.animations.play('move');

    // Dos barcos chilenos de escolta, uno arriba y otro abajo (decorativos)
    const escortOffsetY = 220;

    let entranceEnemyTop = game.add.sprite(game.width + 300, BATTLE_POSITIONS.enemyY - escortOffsetY, 'enemyBoat-scene2');
    entranceEnemyTop.anchor.setTo(0.5);
    entranceEnemyTop.scale.x = -1;
    entranceEnemyTop.width = 300; entranceEnemyTop.height = 250;
    entranceEnemyTop.animations.add('move', [0, 1, 2, 3], 6, true);
    entranceEnemyTop.animations.play('move');

    let entranceEnemyBottom = game.add.sprite(game.width + 300, BATTLE_POSITIONS.enemyY + escortOffsetY, 'enemyBoat-scene2');
    entranceEnemyBottom.anchor.setTo(0.5);
    entranceEnemyBottom.scale.x = -1;
    entranceEnemyBottom.width = 300; entranceEnemyBottom.height = 250;
    entranceEnemyBottom.animations.add('move', [0, 1, 2, 3], 6, true);
    entranceEnemyBottom.animations.play('move');

    game.add.tween(entranceEnemyTop)
        .to({ x: BATTLE_POSITIONS.enemyX + 80 }, entranceDuration, Phaser.Easing.Quadratic.Out, true);

    game.add.tween(entranceEnemyBottom)
        .to({ x: BATTLE_POSITIONS.enemyX + 80 }, entranceDuration, Phaser.Easing.Quadratic.Out, true);

    game.add.tween(entranceEnemy)
        .to({ x: BATTLE_POSITIONS.enemyX }, entranceDuration, Phaser.Easing.Quadratic.Out, true)
        .onComplete.add(() => {
            // Flash rápido para ocultar el pop-in del cambio de state
            game.time.events.add(300, () => {
                let flash = game.add.graphics();
                flash.beginFill(0xffffff, 1);
                flash.drawRect(0, 0, 1717, 916);
                flash.endFill();
                flash.alpha = 0;
                game.add.tween(flash)
                    .to({ alpha: 1 }, 180, Phaser.Easing.Linear.None, true)
                    .onComplete.add(() => game.state.start('firstAct'));
            });
        });
}