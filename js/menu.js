let menuState = {
    preload: () => {
        game.load.image('menuBg', 'img/menu/menu_gameplay.png');
    },
    create: () => {
        document.getElementById('grau-face').style.display = 'none';

        let bg = game.add.image(0, 0, 'menuBg');
        bg.width  = game.width;
        bg.height = game.height;

        let btn = game.add.graphics(0, 0);
        btn.beginFill(0xffffff, 0);
        btn.drawRect(game.width * 0.40, game.height * 0.91, game.width * 0.20, game.height * 0.07);
        btn.endFill();
        btn.inputEnabled = true;
        btn.input.useHandCursor = true;

        btn.events.onInputDown.add(() => { game.state.start('main'); });

        let spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(() => { game.state.start('main'); });
    }
};
