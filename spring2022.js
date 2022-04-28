
var inputs = readline().split(' ');
const baseX = parseInt(inputs[0]); // The corner of the map representing your base
const baseY = parseInt(inputs[1]);
const heroesPerPlayer = parseInt(readline()); // Always 3
const maxX = 18000;
const maxY = 9000;
const enemyX = Math.abs(baseX-maxX);
const enemyY = Math.abs(baseY-maxY);

const findDist = (x1, y1, x2, y2) => {
    return ((x1-x2)**2 + (y1-y2)**2)**0.5;
}

const betweenBase = (tx, ty) => {
    let dirX = -1;
    let dirY = -1;
    if (baseX > 1000) {
        dirX = 1;
        dirY = 1;
    }

    return [tx + (200 * dirX), ty + (150 * dirY)];
}

const stance = (idx) => {
    let x, y;
    if (idx === 0) {
        x = 4000;
        y = 1000;
    } else if (idx === 1) {
        x = 2000;
        y = 2000;
    } else if (idx === 2) {
        x = 1000;
        y = 4000;
    }
    if (baseX > 1000) {
        x = maxX - x;
        y = maxY - y;
    }
    return [x, y];
}
const findThreat = (x, y, threats) => {
    let closest = null;
    let smallestDist = 1000000;
    for (let i = 0; i < threats.length; i++) {
        let d = findDist(x, y, threats[i].x, threats[i].y);
        if (d < smallestDist) {
            smallestDist = d;
            closest = threats[i];
            closest.dist = d;
        }
    }
    console.error("threat: " + JSON.stringify(closest));
    console.error("dist: " + smallestDist);
    return closest;
}

// game loop
while (true) {
    let monsters = [];
    let threats = [];
    let my_heroes = [];
    let op_heroes = [];

    for (let i = 0; i < 2; i++) {
        var inputs = readline().split(' ');
        const health = parseInt(inputs[0]); // Each player's base health
        const mana = parseInt(inputs[1]); // Ignore in the first league; Spend ten mana to cast a spell
    }
    const entityCount = parseInt(readline()); // Amount of heros and monsters you can see
    for (let i = 0; i < entityCount; i++) {
        var inputs = readline().split(' ');
        const id = parseInt(inputs[0]); // Unique identifier
        const type = parseInt(inputs[1]); // 0=monster, 1=your hero, 2=opponent hero
        const x = parseInt(inputs[2]); // Position of this entity
        const y = parseInt(inputs[3]);
        const shieldLife = parseInt(inputs[4]); // Ignore for this league; Count down until shield spell fades
        const isControlled = parseInt(inputs[5]); // Ignore for this league; Equals 1 when this entity is under a control spell
        const health = parseInt(inputs[6]); // Remaining health of this monster
        const vx = parseInt(inputs[7]); // Trajectory of this monster
        const vy = parseInt(inputs[8]);
        const nearBase = parseInt(inputs[9]); // 0=monster with no target yet, 1=monster targeting a base
        const threatFor = parseInt(inputs[10]); // Given this monster's trajectory, is it a threat to 1=your base, 2=your opponent's base, 0=neither
        const tx = x + vx;
        const ty = y + vy;

        let e = {id: id, type: type, x: x, y: y, vx: vx, vy: vy, tx: tx, ty: ty, threatFor: threatFor};
        console.error("entity: " + JSON.stringify(e));
        if (type === 0) {
            monsters.push(e);
            if (e.threatFor === 1) {
                threats.push(e);
            }
        } else if (type === 1) {
            my_heroes.push(e);
        } else {
            op_heroes.push(e);
        }
    }
    for (let i = 0; i < heroesPerPlayer; i++) {

        let homeDist = findDist(baseX, baseY, my_heroes[i].x, my_heroes[i].y);

        let [tx, ty] = stance(i);
        let threat = findThreat(tx, ty, threats);
        let baseThreat = findThreat(baseX, baseY, threats);
        // In the first league: MOVE <x> <y> | WAIT; In later leagues: | SPELL <spellParams>;
        //console.log('WAIT');

        if (baseThreat && baseThreat.dist < 4200) {
            console.error("Gotta protect the base first");
            threat = baseThreat;
        }

        if (homeDist > 9000) {
            console.log("SPELL WIND " + enemyX + " " + enemyY);
        } else if (threats.length > 5) {
            console.log("SPELL WIND " + enemyX + " " + enemyY);
        } else if (i == 1 && baseThreat && baseThreat.dist < 3000) {
            console.log("SPELL WIND " + enemyX + " " + enemyY);
        } else {
            let ntx, nty;
            if (threat) {
                [ntx, nty] = betweenBase(threat.tx, threat.ty);
            } else {
                [ntx, nty] = betweenBase(tx, ty);
            }
            console.log("MOVE " + ntx + " " + nty);
        }

    }
}
