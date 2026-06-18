let endingState = {
    preload: () => {
        game.load.spritesheet('grau-end', 'img/escenas/sprite-grau.png', 384, 384);
        game.load.audio('endingMusic', 'audio/final-scene-background.m4a');
    },

    create: () => {
        hudInGame.style.display = "none";
        let hud2 = document.getElementById('hud-main2');
        if (hud2) hud2.style.display = 'none';

        let endingMusic = game.add.audio('endingMusic');
        endingMusic.loop = true;
        endingMusic.volume = 0.5;
        endingMusic.play();

        // Fondo negro
        game.add.graphics().beginFill(0x000000).drawRect(0, 0, 1717, 916).endFill();

        // Retrato animado de Grau centrado
        let grauSprite = game.add.sprite(1717 / 2, 230, 'grau-end');
        grauSprite.anchor.setTo(0.5);
        grauSprite.width = 300;
        grauSprite.height = 300;
        grauSprite.alpha = 0;
        grauSprite.animations.add('blink', [0, 1, 2, 3, 2, 1, 0], 8, false);
        game.add.tween(grauSprite).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true)
            .onComplete.add(() => {
                // Comienza a parpadear cuando ya es visible
                game.time.events.loop(1000, () => grauSprite.animations.play('blink'));
            });

        // Textos con fade in secuencial
        const lines = [
            { text: 'Miguel Grau Seminario',                   y: 440, font: 'bold 52px Georgia',   fill: '#c8a94a', delay: 2200 },
            { text: '1834  —  1879',                           y: 520, font: '34px Georgia',          fill: '#ffffff', delay: 3400 },
            { text: 'El Caballero de los Mares',               y: 580, font: 'italic 26px Georgia',  fill: '#aaaaaa', delay: 4400 },
            { text: 'Cayó con honor en el Combate de Angamos', y: 635, font: '22px Georgia',          fill: '#aa2222', delay: 5400 },
            { text: 'Su memoria vive en el corazón del Perú',  y: 685, font: '22px Georgia',          fill: '#cccccc', delay: 6400 },
        ];

        lines.forEach((l) => {
            let t = game.add.text(1717 / 2, l.y, l.text, { font: l.font, fill: l.fill, align: 'center' });
            t.anchor.setTo(0.5);
            t.alpha = 0;
            game.add.tween(t).to({ alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, l.delay);
        });

        // Botón restart
        let btn = game.add.text(1717 / 2, 790, 'VOLVER AL INICIO', {
            font: 'bold 30px monospace',
            fill: '#ffffff',
            align: 'center'
        });
        btn.anchor.setTo(0.5);
        btn.alpha = 0;
        btn.inputEnabled = true;
        btn.input.useHandCursor = true;
        btn.events.onInputDown.add(() => {
            endingMusic.stop();
            game.state.start('intro');
        });

        game.add.tween(btn).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 7800)
            .onComplete.add(() => {
                game.add.tween(btn).to({ alpha: 0.3 }, 900, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
            });
    }
};
