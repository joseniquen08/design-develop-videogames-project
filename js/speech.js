function setupSkipVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const skipMap = {
        'intro':  'scene1',
        'scene1': 'scene2',
        'scene2': 'firstAct',
        'intro2': 'scene3',
        'scene3': 'secondAct'
    };

    const activeStates = Object.keys(skipMap);

    function startSession() {
        if (!activeStates.includes(game.state.current)) return;

        const rec = new SpeechRecognition();
        rec.lang = 'es-PE';
        rec.continuous = true;
        rec.interimResults = false;

        rec.onresult = (e) => {
            const txt = e.results[e.results.length - 1][0].transcript.toLowerCase().trim();
            const cur = game.state.current;

            if (txt.includes('saltar') || txt.includes('skip')) {
                const next = skipMap[cur];
                if (next) {
                    game.sound.stopAll();
                    let flash = game.add.graphics();
                    flash.beginFill(0xffffff, 0.6);
                    flash.drawRect(0, 0, 1717, 916);
                    flash.endFill();
                    game.add.tween(flash)
                        .to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true)
                        .onComplete.add(() => {
                            flash.destroy();
                            game.state.start(next);
                        });
                    return;
                }
            }

            if (txt.includes('siguiente') || txt.includes('continuar')) {
                if (cur === 'scene1' && typeof advanceDialogue === 'function') advanceDialogue();
                if (cur === 'scene2' && typeof advanceScene2Dialogue === 'function') advanceScene2Dialogue();
                if (cur === 'scene3' && typeof advanceScene3Dialogue === 'function') advanceScene3Dialogue();
            }
        };

        rec.onerror = (ev) => {
            if (ev.error === 'aborted') return;
            setTimeout(startSession, 500);
        };

        rec.onend = () => {
            if (activeStates.includes(game.state.current)) {
                setTimeout(startSession, 300);
            }
        };

        try { rec.start(); } catch (err) { setTimeout(startSession, 300); }
    }

    startSession();
}
