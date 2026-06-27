let hudInGame = document.getElementById('hud-in-game');

let introState = {
    preload: () => {
        game.load.image('ancla', 'img/Ancla.png');
    },

    create: () => {
        hudInGame.style.display = "none";

        // Fondo negro
        game.add.graphics().beginFill(0x000000).drawRect(0, 0, 1717, 916).endFill();

        // Fecha
        let fecha = game.add.text(1717 / 2, 916 / 2 - 80, '21 de Mayo de 1879', {
            font: 'italic 72px Georgia',
            fill: '#c8a94a',
            align: 'center'
        });
        fecha.anchor.setTo(0.5);
        fecha.alpha = 0;

        // Subtítulo
        let lugar = game.add.text(1717 / 2, 916 / 2, 'Puerto de Iquique, Perú', {
            font: '36px Georgia',
            fill: '#aaaaaa',
            align: 'center'
        });
        lugar.anchor.setTo(0.5);
        lugar.alpha = 0;

        // Descripción
        let desc = game.add.text(1717 / 2, 916 / 2 + 80, 'El blindado Huáscar se prepara para defender las costas peruanas.', {
            font: '24px Georgia',
            fill: '#888888',
            align: 'center'
        });
        desc.anchor.setTo(0.5);
        desc.alpha = 0;

        createAnchorAnimation(game);
        setupSkipVoice();

        // fade-in secuencial
        game.add.tween(fecha)
            .to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0)
            .onComplete.add(() => {
                game.add.tween(lugar)
                    .to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 300)
                    .onComplete.add(() => {
                        game.add.tween(desc)
                            .to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 300)
                            .onComplete.add(() => {
                                // Espera 2 segundos y pasa a scene1
                                game.time.events.add(1000, () => {
                                    // Fade out todo
                                    game.add.tween(fecha).to({ alpha: 0 }, 800, Phaser.Easing.Linear.None, true);
                                    game.add.tween(lugar).to({ alpha: 0 }, 800, Phaser.Easing.Linear.None, true);
                                    game.add.tween(desc).to({ alpha: 0 }, 800, Phaser.Easing.Linear.None, true)
                                        .onComplete.add(() => {
                                            game.state.start('scene1');
                                        });
                                });
                            });
                    });
            });
    }
};