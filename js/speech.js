function setupSpeech() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn('Web Speech API no soportada en este navegador.');
        return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'es-PE';
    rec.continuous = true;
    rec.interimResults = false;

    rec.onresult = (e) => {
        const txt = e.results[e.results.length - 1][0].transcript.toLowerCase().trim();
        console.log('Voz detectada:', txt);

        if (txt.includes('fuego') || txt.includes('dispara')) {
            if (!bulletActive) {
                bullet.reset(mainBoat.x + 150, mainBoat.y + 100);
                bullet.exists = true;
                bulletActive = true;
            }
        }
        if (txt.includes('arriba'))    mainBoat.position.y -= 20;
        if (txt.includes('abajo'))     mainBoat.position.y += 20;
        if (txt.includes('adelante'))  mainBoat.position.x += 20;
        if (txt.includes('atrás') || txt.includes('atras')) mainBoat.position.x -= 20;
        if (txt.includes('pausa'))     game.paused = true;
        if (txt.includes('reanudar')) game.paused = false;
    };

    rec.onerror = (e) => { if (e.error !== 'not-allowed') { try { rec.start(); } catch(e){} } };
    rec.onend   = () => { try { rec.start(); } catch(e){} };

    try { rec.start(); } catch(e) {}
}