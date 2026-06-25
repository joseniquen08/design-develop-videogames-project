let imgRoute = "img";
let maxHP = 100;
let currentHP = 100;
let bulletActive = false;
let mainBoat, enemy, enemyTop, enemyBottom, bullet;
let rightKey, leftKey, upKey, downKey, spaceKey;

let causaGroup;
let specialBarValue = 0;
let specialBarMax   = 4;
let specialReady    = false;
let specialActive   = false;

const BATTLE_POSITIONS = {
    mainBoatX: 1717 / 3 - 250,
    mainBoatY: 916 / 2,
    enemyX: 1717 / 2 + 450,
    enemyY: 916 / 2
};

// speedMult/fireRateMult = enemigos | playerSpeedMult = jugador | damageTakenMult = daño recibido | bossHPMult = HP del boss
window.DIFFICULTY_SETTINGS = {
    facil:   { speedMult: 0.50, fireRateMult: 1.70, playerSpeedMult: 1.3, damageTakenMult: 0.6, bossHPMult: 0.6 },
    normal:  { speedMult: 0.75, fireRateMult: 1.30, playerSpeedMult: 1.0, damageTakenMult: 1.0, bossHPMult: 1.0 },
    dificil: { speedMult: 1.0,  fireRateMult: 1.0,  playerSpeedMult: 0.85, damageTakenMult: 1.5, bossHPMult: 2.0 }
};