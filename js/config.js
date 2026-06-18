let imgRoute = "img";
let maxHP = 100;
let currentHP = 100;
let bulletActive = false;
let mainBoat, enemy, enemyTop, enemyBottom, bullet;
let rightKey, leftKey, upKey, downKey, spaceKey;

const BATTLE_POSITIONS = {
    mainBoatX: 1717 / 3 - 250,
    mainBoatY: 916 / 2,
    enemyX: 1717 / 2 + 450,
    enemyY: 916 / 2
};

// Configuración de dificultad — el baseline actual (speedMult=1, fireRateMult=1) = 'dificil'
window.DIFFICULTY_SETTINGS = {
    facil:   { speedMult: 0.50, fireRateMult: 1.70 },
    normal:  { speedMult: 0.75, fireRateMult: 1.30 },
    dificil: { speedMult: 1.0,  fireRateMult: 1.0 }
};