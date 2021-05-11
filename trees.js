/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

 let cells = [];
 let trees = [];
 const numberOfNeighbors = 6;
 
 const numberOfCells = parseInt(readline()); // 37
 for (let i = 0; i < numberOfCells; i++) {
     var inputs = readline().split(' ');
     const index = parseInt(inputs[0]); // 0 is the center cell, the next cells spiral outwards
     const richness = parseInt(inputs[1]); // 0 if the cell is unusable, 1-3 for usable cells
     // const neigh0 = parseInt(inputs[2]); // the index of the neighbouring cell for each direction
     // const neigh1 = parseInt(inputs[3]);
     // const neigh2 = parseInt(inputs[4]);
     // const neigh3 = parseInt(inputs[5]);
     // const neigh4 = parseInt(inputs[6]);
     // const neigh5 = parseInt(inputs[7]);
     let neighbors = [];
     for (let j = 0; j < numberOfNeighbors; j++) {
         const n = parseInt(inputs[j+2]);
         if (n >= 0) {
             neighbors.push(n);
         }
     }
 
     cells.push({"rich": richness, "index": index, "neighbors": neighbors});
 }
 
 function filterMyTrees(treeSet) {
     return treeSet.filter(t => t.isMine);
 }
 function filterOutDormantTrees(treeSet) {
     return treeSet.filter(t => !t.isDormant);
 }
 function filterBigTrees(treeSet) {
     return treeSet.filter(t => t.size === 3);
 }
 function filterMediumTrees(treeSet) {
     return treeSet.filter(t => t.size === 2);
 }
 function filterSmallTrees(treeSet) {
     return treeSet.filter(t => t.size === 1);
 }
 function filterSeedTrees(treeSet) {
     return treeSet.filter(t => t.size === 0);
 }
 
 function findCell(index) {
     return cells.filter(c => c.index === index)[0];
 }
 function findNeighborsDeep(index, depth, acc) {
     let newAcc = [...acc];
     if (depth > 0) {
         const cell = findCell(index);
         for (let i = 0; i < cell.neighbors.length; i++) { 
             if (!newAcc.includes(cell.neighbors[i])) {
                 newAcc = findNeighborsDeep(cell.neighbors[i], depth - 1, newAcc);
             }
         }
     } else {
         if (!newAcc.includes(index)) {
             newAcc.push(index);
         }
     }
     return newAcc;
 }
 function findNeighbors(tree) {
     return findNeighborsDeep(tree.index, tree.size, []);
 }
 // Find a tree that can plant at targetSpot
 function findParentTree(treeSet, target) {
     // let's look for the smallest trees first
     let newTreeSet = [...treeSet];
     newTreeSet.sort((a, b) => b.size - a.size);
     newTreeSet.reverse();
 
     for (let i = 0; i < newTreeSet.length; i++) {
         if (newTreeSet[i].neighbors.includes(target)) {
             return newTreeSet[i];
         }
     }
     return false;
 
 }
 function findBestTree(treeSet) {
     let ts = [...treeSet];
     ts.sort((a, b) => b.rich - a.rich);
     return ts[0];
 }
 function findBestSeed(treeSet, allTrees) {
     let targetTree = false;
     let targetCell = false;
     const treeSpots = allTrees.map(t => t.index);
     let spots = [...cells].filter(s => s.rich > 0 && !treeSpots.includes(s.index));
     let middleSpots = spots.filter(s => s.index < 19);
     if (middleSpots.length > 4) {
         spots = middleSpots;
     }
     //spots.sort((a, b) => b.rich - a.rich);
     spots.sort((a, b) => (b.rich + (b.index < 7)) - (a.rich + (a.index < 7)));
     console.error("Spots sorted: " + JSON.stringify(spots));

     for (let i = 0; i < spots.length; i++) {
         if (spots[i].rich === 0) {
             console.error("break, since the spots are sorted there are no good ones left");
             break;
         } 
 
         //console.error("Looking at spot: " + spots[i].index + " rich: " + spots[i].rich);
         const tree = findParentTree(treeSet, spots[i].index);
         if (tree) {
             targetTree = tree;
             targetCell = spots[i].index;
             break;
         }

        //  if (i > 10) {
        //      console.error("taking too long");
        //      break;
        //  }
     }

     console.error("spot found?");
     return [targetTree, targetCell];
 }
 function completeTree(treeSet, tree) {
     return treeSet.filter(t => t.index !== tree.index);
 }
 function growTree(treeSet, tree) {
     // console.error("growing...");
     // console.error("ts: " + JSON.stringify(treeSet));
     // console.error("tree: " + JSON.stringify(tree));
     for (let i = 0; i < treeSet.length; i++) {
         if (treeSet[i].index === tree.index) {
             treeSet[i].size++;
         }
     }
     
     //console.error("ts after: " + JSON.stringify(treeSet));
 
     return treeSet;
 }
 
 //const treeCosts = {1: 3, 2: 7, 3: 1000};
 function calcGrowCosts(treeSet) {
     // assuming set of only my trees
     //const cntSize2 = (treeSet.filter(t => t.size === 2)).length;
     const cntSize1 = (treeSet.filter(t => t.size === 1)).length;
     const cntSize2 = (treeSet.filter(t => t.size === 2)).length;
     const cntSize3 = (treeSet.filter(t => t.size === 3)).length;
     for (let i = 0; i < treeSet.length; i++) { 
         let size = treeSet[i].size;
         if (size === 0) {
             treeSet[i].cost = 1 + cntSize1;
         } else if (size === 1) {
             treeSet[i].cost = 3 + cntSize2;
         } else if (size ===2 ) {
             treeSet[i].cost = 7 + cntSize3;
         } else {
             treeSet[i].cost = 1000;
         }
     }
 }
 
 
 
 // game loop
 let lastDay = -1;
 let dayIter = 0;
 while (true) {
     const day = parseInt(readline()); // the game lasts 24 days: 0-23
     if (day === lastDay) {
         dayIter++;
     } else {
         lastDay = day;
         dayIter = 0;
     }
     console.error("Day: " + day + " / " + dayIter);
     //console.error("Cells: " + JSON.stringify(cells));
     const nutrients = parseInt(readline()); // the base score you gain from the next COMPLETE action
     var inputs = readline().split(' ');
     let sun = parseInt(inputs[0]); // your sun points
     const score = parseInt(inputs[1]); // your current score
     var inputs = readline().split(' ');
     const oppSun = parseInt(inputs[0]); // opponent's sun points
     const oppScore = parseInt(inputs[1]); // opponent's score
     const oppIsWaiting = inputs[2] !== '0'; // whether your opponent is asleep until the next day
     const numberOfTrees = parseInt(readline()); // the current amount of trees
     trees = [];
     for (let i = 0; i < numberOfTrees; i++) {
         var inputs = readline().split(' ');
         const cellIndex = parseInt(inputs[0]); // location of this tree
         const size = parseInt(inputs[1]); // size of this tree: 0-3
         const isMine = inputs[2] !== '0'; // 1 if this is your tree
         const isDormant = inputs[3] !== '0'; // 1 if this tree is dormant
        
         t = {"index": cellIndex, "size": size, "isMine": isMine, 
             "isDormant": isDormant, "rich": cells[cellIndex].rich};
 
         t.neighbors = findNeighbors(t);
         trees.push(t);
     }
     const numberOfPossibleActions = parseInt(readline()); // all legal actions
     let myTrees = filterMyTrees(trees);
     calcGrowCosts(myTrees);
     
 
     // dumbest shit ever
     for (let i = 0; i < numberOfPossibleActions; i++) {
         const possibleAction = readline();
     }
 
     let cmd = ""
     for (let i = 0; i < 1; i++) {
         console.error("sun: " + sun);
         let setCommand = false;
         //const possibleAction = readline(); // try printing something from here to start with
         // GROW <index>
         // COMPLETE <index>
         // WAIT
         //console.error("Trees: " + JSON.stringify(myTrees));
 
         if (myTrees.length > 0) {
             const bigTrees = filterBigTrees(myTrees);
             const usableBigTrees = filterOutDormantTrees(bigTrees);
             const mediumTrees = filterMediumTrees(myTrees);
             const usableMediumTrees = filterOutDormantTrees(mediumTrees);
             const smallTrees = filterSmallTrees(myTrees);
             const usableSmallTrees = filterOutDormantTrees(smallTrees);
             const seedTrees = filterSeedTrees(myTrees);
             const usableSeedTrees = filterOutDormantTrees(seedTrees);
             const allUsableTrees = usableBigTrees.concat(usableMediumTrees, usableSmallTrees);
 
             if (usableBigTrees.length > 0 && sun >= 4 && day >= 12 && (dayIter < 1 || day >= 21)) {
                 //  if ((usableBigTrees.length > 0 && sun >= 12 && day < 12) ||
                 //      (usableBigTrees.length > 0 && sun >= 4 && day >= 12)) {
                 let best = findBestTree(usableBigTrees);
                 cmd += "COMPLETE " + best.index + " | ";
                 //myTrees = completeTree(myTrees, best);
                 //calcGrowCosts(myTrees);
                 setCommand = true
             }
             console.error("checking meds");
            //  if (!setCommand && usableMediumTrees.length > 0 && sun >= (7 + bigTrees.length)) {
            const medSunGoal = day < 12 ? (12 + bigTrees.length) : (7 + bigTrees.length);
            if (!setCommand && usableMediumTrees.length > 0 && sun >= medSunGoal && dayIter < 1) {
                 let best = findBestTree(usableMediumTrees);
                 cmd += "GROW " + best.index + " | ";
                 
                 //myTrees = growTree(myTrees, best);
                 //sun -= best.cost;
                 //calcGrowCosts(myTrees);
                 setCommand = true
             }
             const smallSunGoal = day < 10 ? (3 + mediumTrees.length) : (3 + mediumTrees.length);
             if (!setCommand && usableSmallTrees.length > 0 && sun >= smallSunGoal) {
                 let best = findBestTree(usableSmallTrees);
                 cmd += "GROW " + best.index + " | ";
 
 
                 //myTrees = growTree(myTrees, best);
                 //sun -= best.cost;
                 //calcGrowCosts(myTrees);
                 setCommand = true
             }
             if (!setCommand && usableSeedTrees.length > 0 && sun >= (1 + smallTrees.length)) {
                 let best = findBestTree(usableSeedTrees);
                 cmd += "GROW " + best.index + " | ";
 
                 //myTrees = growTree(myTrees, best);
                 //sun -= best.cost;
                 //calcGrowCosts(myTrees);
                 setCommand = true
             }
             console.error("seeding: tree len=" + allUsableTrees.length + ", sunCost=" + seedTrees.length);
             if (!setCommand && allUsableTrees.length > 0 && sun >= (seedTrees.length)) {
 
                 console.error("Looking for a spot to seed");
                 let [best, dest] = findBestSeed(allUsableTrees, trees);

                 console.error("Found: best=" + best + " dest=" + dest);
                 if (best) {
                     cmd += "SEED " + best.index + " " + dest + " | ";
 
                     //myTrees = growTree(myTrees, best);
                     //sun -= best.cost;
                     //calcGrowCosts(myTrees);
                     setCommand = true
                 }
             }
         }
         if (!setCommand) {
             cmd += "WAIT | ";
             console.error("nothing to do so waiting");
         }
     }
 
     const finalCmd = cmd.slice(0, -3);
     console.error("CMD: " + finalCmd);
 
     // GROW cellIdx | SEED sourceIdx targetIdx | COMPLETE cellIdx | WAIT <message>
     console.log(finalCmd);
 }
 