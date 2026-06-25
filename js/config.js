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