let dialogIndex = 0;
let isTyping = false;
let currentText = '';
let typewriterTimer = null;
let scene1TypingIndex = 0;
let scene1CharacterName, scene1DialogText, scene1ContinueHint, scene1EnterKey;
let spriteGrau, spritePrado;

let textBlip

const dialogues = [
    { character: 'PRADO', text: 'Almirante Grau, la situación es crítica. Chile ha declarado la guerra y su flota supera a la nuestra.', speaker: 'prado' },
    { character: 'GRAU', text: 'Lo sé, mi Presidente. Pero mientras el Huáscar flote, el Perú no estará indefenso.', speaker: 'grau' },
    { character: 'PRADO', text: 'Necesito que proteja nuestras costas. Iquique está bloqueada la armada de Arturo Prat.', speaker: 'prado' },
    { character: 'GRAU', text: 'Partiré de inmediato. Le juro que cumpliré con mi deber hasta el último aliento.', speaker: 'grau' },
    { character: 'PRADO', text: 'Que Dios lo acompañe, Almirante. El Perú confía en usted.', speaker: 'prado' },
];

let scene1State = {
    preload: () => {
        // Sonidos
        game.load.audio('bgMusic', 'audio/scene-1-background.m4a');
        game.load.audio('textSound', 'audio/text-digit-sound.mp3');

        // Sprite / Sprite-sheets
        game.load.image('bg-palace', 'img/escenas/background-palace.png');
        game.load.spritesheet('sprite-grau-scene', 'img/escenas/sprite-grau.png', 384, 384);
        game.load.spritesheet('sprite-prado-scene', 'img/escenas/sprite-prado.png', 896, 896);
    },

    create: () => {
        let music = game.add.audio('bgMusic');
        music.loop = true;
        music.volume = 0.05;
        music.play();

        game.scene1Music = music;

        textBlip = game.add.audio('textSound');
        textBlip.volume = 0.8
        textBlip.loop = true;

        // remove hud from battle in this scene
        hudInGame.style.display = "none";

        dialogIndex = 0;
        isTyping = false;

        // Fondo palacio
        let bg = game.add.sprite(0, 0, 'bg-palace');
        bg.width = 1717;
        bg.height = 916;

        // Overlay negro semitransparente
        let overlay = game.add.graphics();
        overlay.beginFill(0x000000, 0.5);
        overlay.drawRect(0, 0, 1717, 916);
        overlay.endFill();

        // Sprite Grau — izquierda
        spriteGrau = game.add.sprite(80, 916 - 500 - 190, 'sprite-grau-scene');
        spriteGrau.anchor.setTo(0, 0);
        spriteGrau.width = 450;
        spriteGrau.height = 450;
        spriteGrau.animations.add('blink', [0, 1, 2, 3, 2, 1, 0], 8, false);
        game.time.events.loop(Phaser.Math.Between ?
            3000 : 3000, () => spriteGrau.animations.play('blink'));

        // Sprite Prado — derecha
        spritePrado = game.add.sprite(1717 - 530, 916 - 500 - 190, 'sprite-prado-scene');
        spritePrado.anchor.setTo(0, 0);
        spritePrado.width = 450;
        spritePrado.height = 450;
        spritePrado.alpha = 0;
        spritePrado.animations.add('blink', [0, 1, 2, 3, 4, 3, 2, 1, 0], 8, false);
        game.time.events.loop(3500, () => {
            if (spritePrado.alpha > 0) spritePrado.animations.play('blink');
        });

        // Fade in de Grau al inicio
        game.add.tween(spriteGrau).from({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);

        // Caja de diálogo
        let dialogBox = game.add.graphics();
        dialogBox.beginFill(0x000000, 0.75);
        dialogBox.drawRoundedRect(60, 680, 1600, 200, 12);
        dialogBox.endFill();
        dialogBox.lineStyle(2, 0xdaa520, 1);
        dialogBox.drawRoundedRect(60, 680, 1600, 200, 12);

        // Nombre del personaje
        scene1CharacterName = game.add.text(100, 695, '', {
            font: '28px monospace',
            fill: '#daa520',
            fontWeight: 'bold'
        });

        // Texto del diálogo
        scene1DialogText = game.add.text(100, 740, '', {
            font: '22px monospace',
            fill: '#ffffff',
            wordWrap: true,
            wordWrapWidth: 1520
        });

        // Hint continuar
        scene1ContinueHint = game.add.text(1580, 850, '▶', {
            font: '22px monospace',
            fill: '#daa520'
        });
        game.add.tween(scene1ContinueHint)
            .to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);

        // Input
        scene1EnterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        game.input.onDown.add(advanceDialogue);

        // Voz
        setupScene1Voice();

        // Primer diálogo con delay para que se vea a Grau primero
        game.time.events.add(1500, () => showDialogue(0));
    },

    update: () => {
        if (scene1EnterKey.justDown) {
            advanceDialogue();
        }
    }
};

function showDialogue(index) {
    if (index >= dialogues.length) {
        if (game.scene1Music) {
            game.add.tween(game.scene1Music)
                .to({ volume: 0 }, 1000, Phaser.Easing.Linear.None, true)
                .onComplete.add(() => {
                    game.scene1Music.stop();
                    game.state.start('scene2');
                });
        } else {
            game.state.start('scene2');
        }
        return;
    }

    const dialogue = dialogues[index];
    scene1CharacterName.setText(dialogue.character);
    scene1DialogText.setText('');
    isTyping = true;
    scene1TypingIndex = 0;
    currentText = dialogue.text;

    const textDuration = currentText.length * 40;

    textBlip.play();
    game.time.events.add(textDuration, () => {
        if (textBlip.isPlaying) textBlip.stop();
    });

    // Mostrar/ocultar sprites según quién habla
    if (dialogue.speaker === 'grau') {
        game.add.tween(spriteGrau).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true);
        game.add.tween(spritePrado).to({ alpha: 0.4 }, 400, Phaser.Easing.Linear.None, true);
        scene1CharacterName.fill = '#4af0ff'; // azul para Grau
    } else {
        game.add.tween(spritePrado).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true);
        game.add.tween(spriteGrau).to({ alpha: 0.4 }, 400, Phaser.Easing.Linear.None, true);
        scene1CharacterName.fill = '#daa520'; // dorado para Prado

        // Primera vez que habla Prado — fade in
        if (index === 0) {
            spritePrado.alpha = 0;
            game.add.tween(spritePrado).to({ alpha: 1 }, 600, Phaser.Easing.Linear.None, true);
        }
    }

    textBlip.play();

    // Efecto máquina de escribir
    typewriterTimer = game.time.events.loop(40, () => {
        if (scene1TypingIndex < currentText.length) {
            scene1DialogText.setText(currentText.substring(0, scene1TypingIndex + 1));
            scene1TypingIndex++;

        } else {
            isTyping = false;
            game.time.events.remove(typewriterTimer);
            if (textBlip.isPlaying) textBlip.stop();
        }
    });
}

function advanceDialogue() {
    if (isTyping) {
        isTyping = false;
        game.time.events.remove(typewriterTimer);
        scene1DialogText.setText(currentText);
        scene1TypingIndex = currentText.length;
        return;
    }
    dialogIndex++;
    showDialogue(dialogIndex);
}

function setupScene1Voice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    function startSession() {
        if (game.state.current !== 'scene1') return;

        const rec = new SpeechRecognition();
        rec.lang = 'es-PE';
        rec.continuous = false;
        rec.interimResults = false;

        rec.onresult = (e) => {
            const txt = e.results[0][0].transcript.toLowerCase().trim();
            if (txt.includes('siguiente')) {
                advanceDialogue();
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