const canvas = document.getElementById("simulator");
const ctx = canvas.getContext("2d");

const cellSize = 5
const rows = 100;
const cols = 200;
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;
grid = Array.from({ length: rows + 2}, () => Array(cols + 2).fill(0));
cow = [[14, 16],[15, 16],[17, 16],[16, 16],[13, 15],[12, 16],[12, 17],[12, 18],[12, 19],[12, 20],[12, 21],[14, 14],[15, 13],[11, 22],[10, 23],[11, 24],[12, 23],[13, 22],[14, 21],[15, 21],[16, 21],[17, 21],[15, 20],[15, 19],[15, 18],[15, 17],[10, 22],[9, 21]]
snowman = [[18, 20],[18, 21],[18, 22],[17, 23],[16, 24],[15, 24],[14, 23],[13, 22],[13, 21],[13, 20],[14, 19],[15, 18],[16, 18],[17, 19],[12, 20],[12, 21],[12, 22],[11, 23],[10, 23],[9, 22],[9, 21],[9, 20],[10, 19],[11, 19],[8, 21],[7, 22],[6, 21],[7, 20],[8, 20],[8, 22],[6, 22],[6, 20]]
wheel = [[10, 18],[11, 19],[12, 20],[13, 21],[14, 22],[15, 23],[16, 24],[14, 21],[13, 22],[17, 25],[12, 23],[11, 24],[10, 25],[15, 20],[16, 19],[17, 18],[11, 18],[12, 17],[13, 17],[14, 17],[15, 17],[16, 18],[17, 19],[18, 20],[19, 21],[20, 21],[20, 22],[19, 22],[18, 23],[17, 24],[16, 25],[15, 25],[14, 25],[13, 25],[12, 25],[11, 25]]
lance = [[11, 14],[11, 13],[12, 13],[12, 14],[10, 14],[10, 13],[10, 12],[11, 12],[12, 12],[11, 15],[11, 16],[7, 18],[8, 17],[9, 17],[10, 17],[11, 17],[12, 17],[13, 17],[14, 17],[15, 18],[15, 19],[15, 20],[14, 20],[14, 21],[14, 22],[13, 22],[13, 23],[13, 24],[13, 25],[13, 26],[7, 19],[7, 20],[8, 20],[8, 21],[8, 22],[9, 22],[9, 23],[9, 24],[9, 25],[9, 26],[10, 20],[10, 19],[11, 19],[12, 19],[12, 20],[12, 21],[11, 21],[10, 21],[12, 26],[12, 27],[12, 28],[12, 29],[12, 30],[12, 31],[12, 32],[12, 33],[10, 26],[10, 27],[10, 28],[10, 29],[10, 30],[10, 31],[10, 32],[10, 33],[10, 34],[10, 35],[10, 36],[10, 37],[10, 38],[11, 39],[12, 38],[12, 37],[12, 36],[12, 35],[12, 34]]
let fps = 0
let birthRules = [2, 3];
let birthChance = 1.0; // 100% chance of birth
let survivalChance = 1.0; // 100% chance of survival
let survivalRules = [2, 3, 4];
list=[]

//set up canvas (AI)
const speedSlider = document.getElementById("speedSlider");
const speedDisplay = document.getElementById("speedDisplay");
let lastUpdate = 0;


drawGrid();
// Count the living cells around (i, j)
function count(grid1, i, j) {

    let a = 0;

    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            a += grid1[i+r][j+c];
    }
}
    a -= grid1[i][j]
    return a;
}

// Apply the Game of Life rules
function rules(grid1, i, j, count) {

    if (
        ((birthRules.includes(count)) && (grid1[i][j] === 0) && Math.random() < birthChance)  ||
        ((survivalRules.includes(count)) && grid1[i][j] === 1) && Math.random() < survivalChance) {
        return 1;

    } return 0;
}

// Create the next generation
function tic(grid1) {



    let grid2 = Array.from(
        { length: rows + 2 },
        () => Array(cols + 2).fill(0)
    );
    let births = 0;
    let deaths = 0;
    let population = 0;
    for (let i = 1; i < rows+1; i++) {
        for (let j = 1; j < cols+1; j++) {
            
            grid2[i][j] =
                rules(grid1, i, j, count(grid1, i, j));
            if (grid2[i][j] === 1 && grid1[i][j] === 0) {
                births++;
            } else if (grid2[i][j] === 0 && grid1[i][j] === 1) {
                deaths++;
            }
            if (grid2[i][j] === 1) {
                population++;
            }
        }

    }
    updateStatistics(births, deaths, population);
    return grid2;
}



function drawGrid() {

    for (let x = 0; x <= canvas.width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    //creates lines to seperate boxes, might delete
}

function render(grid) {

ctx.clearRect(0, 0, canvas.width, canvas.height);
drawGrid();

for (let row = 1; row < grid.length; row++) {
    for (let col = 1; col < grid[row].length; col++) {
        if (grid[row][col] === 1) {
            ctx.fillRect(
                (col-1) * cellSize,
                (row-1) * cellSize,
                cellSize,
                cellSize
            );
        }
    }
}
//fills living cells

}

canvas.addEventListener("click", function(event) {

    const col = Math.floor(event.offsetX / cellSize);
    const row = Math.floor(event.offsetY / cellSize);

    grid[row+1][col+1] = grid[row+1][col+1] === 0 ? 1 : 0;

    render(grid);
    list.push("[" + row + ", " + col + "]");
    console.log("list" + list);
});



speedSlider.addEventListener("input", function() {

    fps = Number(speedSlider.value);

    speedDisplay.textContent = fps + " Hz";
});

const birthsCount = document.getElementById("birthsCount");
const deathsCount = document.getElementById("deathsCount");
const populationCount = document.getElementById("populationCount");
const birthRate = document.getElementById("birthRate");
const birthChanceDisplay = document.getElementById("birthChance");
const survivalChanceDisplay = document.getElementById("survivalChance");


function updateStatistics(births, deaths, population) {
    birthsCount.textContent = births;
    deathsCount.textContent = deaths;
    populationCount.textContent = population + " or " + (population / ((rows)*(cols)) * 100).toFixed(2) + " %";
    birthRate.textContent = population > 0 ? ((births / population) * 100).toFixed(2) : 0;
    if (births / population > 0.4) {
        birthChance = Math.max(0, birthChance - .001); // Decrease birth chance by 1%
    } else if (births / population < 0.2) {
        birthChance = Math.min(1, birthChance + .003);} // Increase birth chance by 1%
    if (population > (rows)*(cols)*0.4) {
        survivalChance = Math.max(0, survivalChance - .001); // Decrease survival chance by 1%
    } else if (population < (rows)*(cols)*0.2) {
        survivalChance = Math.min(1, survivalChance + .003); // Increase survival chance by 1%
    }
    birthChanceDisplay.textContent = (birthChance * 100).toFixed(2) + "%";
    survivalChanceDisplay.textContent = (survivalChance * 100).toFixed(2) + "%";
}

    
//translation AI

const stepButton = document.getElementById("stepButton");

stepButton.addEventListener("click", function() {
    grid = tic(grid);
    render(grid);
});
const clearButton = document.getElementById("clearButton");

clearButton.addEventListener("click", function() {
    grid = Array.from({ length: rows + 2}, () => Array(cols + 2).fill(0));
    render(grid);
    birthChance = 1.0; // Reset birth chance to 100%
    survivalChance = 1.0; // Reset survival chance to 100%
    updateStatistics(0, 0, 0); // Reset statistics
});



function animate(timestamp) {

    let fps = Number(speedSlider.value);

    if (fps > 0) {

        let interval = 1000 / fps;

        if (timestamp - lastUpdate >= interval) {

            grid = tic(grid);

            render(grid);
            console.log("Grid updated at " + fps + " Hz");

            lastUpdate = timestamp;
        }
    }

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

const ruleButtons = document.querySelectorAll(".rule-button");
ruleButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        button.classList.toggle("selected");
        console.log("Button clicked: " + button.dataset.value + " (" + button.dataset.rule + ")");
        if (button.dataset.rule === "birth") {
            if (button.classList.contains("selected")) {
                birthRules.push(parseInt(button.dataset.value));
                console.log("Birth rule added: " + button.dataset.value);
            } else {
                birthRules = birthRules.filter(
                    (rule) => rule !== parseInt(button.dataset.value)
                );
            }
        } else if (button.dataset.rule === "survival") {
            if (button.classList.contains("selected")) {
                survivalRules.push(parseInt(button.dataset.value));
            } else {
                survivalRules = survivalRules.filter(
                    (rule) => rule !== parseInt(button.dataset.value)
                );
            }
        }
        console.log("Current birth rules: " + birthRules);
        console.log("Current survival rules: " + survivalRules);

    });

});

const snowmanButton = document.getElementById("snowmanPreset");
const cowButton = document.getElementById("cowPreset");

snowmanButton.addEventListener("click", function() {
    grid = Array.from({ length: rows + 2}, () => Array(cols + 2).fill(0));
    // Place the snowman pattern
    snowman.forEach(function([r, c]) {
        grid[r][c] = 1;
    });
    render(grid);
});

cowButton.addEventListener("click", function() {
    grid = Array.from({ length: rows + 2}, () => Array(cols + 2).fill(0));
    // Place the cow pattern
    cow.forEach(function([r, c]) {
        grid[r][c] = 1;
    });
    render(grid);
});

const wheelButton = document.getElementById("wheelPreset");

wheelButton.addEventListener("click", function() {
    grid = Array.from({ length: rows + 2}, () => Array(cols + 2).fill(0));
    // Place the wheel pattern
    wheel.forEach(function([r, c]) {
        grid[r][c] = 1;
    });
    render(grid);
});

const lanceButton = document.getElementById("lancePreset");

lanceButton.addEventListener("click", function() {
    grid = Array.from({ length: rows + 2}, () => Array(cols + 2).fill(0));
    // Place the lance pattern
    lance.forEach(function([r, c]) {
        grid[r][c] = 1;
    });
    render(grid);
});