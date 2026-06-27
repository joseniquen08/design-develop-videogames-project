let intro2State = {
    preload: () => {
        game.load.image('ancla', 'img/Ancla.png');
    },

    create: () => {
        hudInGame.style.display = "none";

        game.add.graphics().beginFill(0x000000).drawRect(0, 0, 1717, 916).endFill();

        let line1 = game.add.text(1717 / 2, 916 / 2 - 80, '8 de Octubre de 1879', {
            font: 'italic 72px Georgia',
            fill: '#c8a94a',
            align: 'center'
        });
        line1.anchor.setTo(0.5);
        line1.alpha = 0;

        let line2 = game.add.text(1717 / 2, 916 / 2, 'Punta Angamos, Antofagasta', {
            font: '36px Georgia',
            fill: '#aaaaaa',
            align: 'center'
        });
        line2.anchor.setTo(0.5);
        line2.alpha = 0;

        let line3 = game.add.text(1717 / 2, 916 / 2 + 80, 'El último viaje del Huáscar', {
            font: 'italic 24px Georgia',
            fill: '#888888',
            align: 'center'
        });
        line3.anchor.setTo(0.5);
        line3.alpha = 0;

        createAnchorAnimation(game);
        setupSkipVoice();

        game.add.tween(line1)
            .to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0)
            .onComplete.add(() => {
                game.add.tween(line2)
                    .to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 500)
                    .onComplete.add(() => {
                        game.add.tween(line3)
                            .to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 500)
                            .onComplete.add(() => {
                                game.time.events.add(500, () => {
                                    game.add.tween(line1).to({ alpha: 0 }, 800, Phaser.Easing.Linear.None, true);
                                    game.add.tween(line2).to({ alpha: 0 }, 800, Phaser.Easing.Linear.None, true);
                                    game.add.tween(line3).to({ alpha: 0 }, 800, Phaser.Easing.Linear.None, true)
                                        .onComplete.add(() => game.state.start('scene3'));
                                });
                            });
                    });
            });
    }
};
