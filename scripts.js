const PLAYER_SPEED = 25;
const ENERGY_MAX = 100;
let playerEnergy = ENERGY_MAX;
let playerPoints = 0;
let inputDirection = { x: 0, y: 0 };
let playerPosition = { x: 3, y: 10 }
const myBoard = document.getElementById("board");
const myEnergy = document.getElementById("energy");
const myPoints = document.getElementById("points");
const myLevel = document.getElementById("level");
const BOARD_HEIGHT = 20;
const BOARD_LENGTH = 20;
let myHeight = 9;
let currCol = 3;
let myCounter = 0; //used for gravity
let data = [4, 5, 6, 7, 6, 5, 4, 5, 6, 7, 8, 9, 8, 7, 6, 7, 8, 9, 10, 9];
let data1 = [2, 3, 4, 5, 6, 5, 4, 5, 6, 7, 8, 9, 10, 9, 8, 6, 8, 9, 10, 9];
let data2 = [1, 3, 4, 5, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 5, 4, 3, 4, 5];
let data3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 3, 4, 5, 6];
let data0 = [4, 5, 6, 7, 6, 5, 4, 5, 6, 7, 8, 9, 8, 7, 6, 7, 8, 9, 10, 9];
let dataCounter = 1; //level selector..
let currLevel = 1;
let lastRenderTime = 0;

let myPeaks = findPeak(data); //these are updated when data/terrain is switched.. see after switch like (80?) lines down
let myValleys = findValley(data);

function main(currentTime) {
    window.requestAnimationFrame(main);
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
    if (secondsSinceLastRender < 1 / PLAYER_SPEED) return;
    lastRenderTime = currentTime;
    // console.log(secondsSinceLastRender);
    update();
    draw();
}

window.requestAnimationFrame(main);

function update() {

    processInput();
    if (playerEnergy < ENERGY_MAX)
    // playerEnergy += 500;
        playerEnergy += 3;

    let temp = playerPosition.x
    if ((data[temp] < (20 - playerPosition.y + 1) && inputDirection.x == 1)) {
        playerPosition.x += inputDirection.x;
    }
    temp = playerPosition.x - 2
    if (temp >= 0 && (data[temp] < (20 - playerPosition.y + 1) && inputDirection.x == -1)) {
        playerPosition.x += inputDirection.x;
    }
    // console.log("PLAYER X: " + (playerPosition.x - 1));
    if ((data[playerPosition.x - 1] < (20 - playerPosition.y) && inputDirection.y == 1)) {
        playerPosition.y += inputDirection.y;
    }

    if (inputDirection.y == -1 && (playerPosition.y) > 0 && playerEnergy > 5) {
        playerPosition.y += inputDirection.y;
        playerEnergy -= 20;
    }

    //gravity..
    if (data[playerPosition.x - 1] < (20 - playerPosition.y) && myCounter >= 5) {
        playerPosition.y += 1;
        myCounter = 0;
    }
    ++myCounter;
    myEnergy.innerHTML = "Energy: " + playerEnergy;
    myPoints.innerHTML = "Points: " + playerPoints;
    myLevel.innerHTML = "Level: " + currLevel;
    //player reaches end of the map
    if (playerPosition.x == 20) {
        switch (dataCounter) {
            case 1:
                data = data1;
                ++dataCounter;
                playerPoints += 5;
                ++currLevel;
                break;
            case 2:
                data = data2;
                ++dataCounter;
                playerPoints += 10;
                ++currLevel;
                break;
            case 3:
                data = data3;
                ++dataCounter;
                playerPoints += 15;
                ++currLevel;
                break;
            default:
                data = data0;
                dataCounter = 1;
                playerPoints += 20;
                currLevel -= 3;
        }
        myPeaks = findPeak(data);
        myValleys = findValley(data)
        playerPosition.x = 0;
        playerPosition.y = 20 - (data[0] + 1)
    }
    inputDirection = { x: 0, y: 0 };
}



function draw() {
    myBoard.innerHTML = ""
    drawPlayer();
    //terain
    drawWater(myPeaks, myValleys);
    for (let i = 1; i < BOARD_LENGTH + 1; ++i) {
        drawTerrain(BOARD_HEIGHT - data[i - 1], i);
    }


}
///////////////////////////////////////////////////////////////
// input functions
///////////////////////////////////////////////////////////////
function processInput() {
    window.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp':
                inputDirection = { x: 0, y: -1 };
                break;
            case 'ArrowLeft':
                inputDirection = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
                inputDirection = { x: 1, y: 0 };
                break;
            case 'ArrowDown':
                inputDirection = { x: 0, y: 1 };
                break;
        }

    })
}

///////////////////////////////////////////////////////////////
// player functions
///////////////////////////////////////////////////////////////
function drawPlayer() {
    const playerElement = document.createElement('div');
    playerElement.style.gridRowStart = playerPosition.y;
    playerElement.style.gridColumnStart = playerPosition.x;
    playerElement.classList.add('player');
    myBoard.appendChild(playerElement);


}




///////////////////////////////////////////////////////////////
// terrain functions
///////////////////////////////////////////////////////////////
function drawTerrain(myHeight, currCol) {
    for (let i = BOARD_HEIGHT; i > myHeight; --i) {
        let terrainElement = document.createElement('div');
        terrainElement.style.gridRowStart = i; //y
        terrainElement.style.gridColumnStart = currCol; //x
        if (i == (myHeight + 1)) {
            terrainElement.classList.add('terrain-top');
        } else {
            terrainElement.classList.add('terrain');
        }
        myBoard.appendChild(terrainElement);
    }
}


function drawWater(myPeaks, myValleys, ) {
    let length = 0;
    for (let i = 0; i < myValleys.length; ++i) {
        length = ((myValleys[i] - myPeaks[i]) * 2) - 1
            // console.log(length)
            // for width/length of water
        for (let j = 0; j < length; ++j) {
            let waterElement = document.createElement('div');
            waterElement.style.gridRowStart = 20 - data[myPeaks[i]]; //y ... y = 20 - num
            waterElement.style.gridColumnStart = myPeaks[i] + 1 + j; //x
            waterElement.classList.add('water');
            myBoard.appendChild(waterElement);
            let depth = data[myPeaks[i] - 1] - data[myValleys[i] - 1];
            // for depth
            for (let z = 0; z < depth; ++z) {
                let waterElement = document.createElement('div');
                waterElement.style.gridRowStart = 20 - data[myPeaks[i]] + z; //y ... y = 20 - num
                waterElement.style.gridColumnStart = myPeaks[i] + 1 + j; //x
                waterElement.classList.add('water');
                myBoard.appendChild(waterElement);
            }
        }
    }
}


function findPeak(data) {
    //start at 1 .. 0 can not be a peak
    let my_peaks = [];
    for (let i = 1; i < data.length; ++i) {
        if (data[i + 1] && data[i] > data[i + 1] && data[i] > data[i - 1]) {
            // console.log("PEAK DETECTED AT INDEX: " + i + ". ")
            my_peaks.push(i + 1)
        }
    }
    return my_peaks;
}

function findValley(data) {
    let my_valleys = [];
    for (let i = 1; i < data.length; ++i) {
        if (data[i + 1] && data[i] < data[i + 1] && data[i] < data[i - 1]) {
            // console.log("VALLEY DETECTED AT INDEX: " + i + ". ")
            my_valleys.push(i + 1)
        }
    }
    return my_valleys;
}



// playerPosition.y += inputDirection.y;





// const isThereARockAt = (x, y) => {
//     // Loop through rocks, and check if any rock is at the given point.
//     const rock = document.getElementsByClassName("terrain")

//     // const myBoard = document.getElementById("board");
//     // for (let i = 0; i < rock.length; ++i) {
//     // console.log("ROCK: " + rock[0].getAttribute("data"));

//     // }
//     // if (rock.x === x && rock.y === y) {
//     //     return true;
//     // }
//     return false;
// };
// drawTerrain(19, 2)
// DRAW FIRST WATER ONLY:
// waterElement.style.gridRowStart = 20 - data[myPeaks[i]]; //y ... y = 20 - num
// waterElement.style.gridColumnStart = myPeaks[i] + 1; //x
// console.log(myPeaks);
// console.log(myValleys);
// if (playPosition.x)
// if((x,y) != terrain)
// console.log(isThereARockAt((playerPosition.x + inputDirection.x), (playerPosition.y + inputDirection.y)));
// console.log("BOARD : " + myBoard.attributes);
// console.log("PLAYER Y: " + (20 - playerPosition.y));
// console.log("DATA[TEMP] : " + data[temp]);
// console.log(data)
// data.splice(0, 1)
// data.push(8)
// console.log(data)
// console.log(data.pop())
// console.log(data.array.splice(0, 2))
// console.log("MY COUNTER: " + myCounter);
// console.log("PLAYER ENERGY: " + playerEnergy);