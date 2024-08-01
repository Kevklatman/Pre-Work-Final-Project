// Create the table
let table = document.createElement('table');
document.body.appendChild(table);

// Create hole row
let holeRow = document.createElement('tr');
holeRow.innerHTML = '<th>Hole</th>';
for (let i = 1; i <= 18; i++) {
    holeRow.innerHTML += `<th>${i}</th>`;
    if (i === 9) holeRow.innerHTML += '<th>Out</th>';
}
holeRow.innerHTML += '<th>In</th><th>Total</th>';
table.appendChild(holeRow);

// Create par row
let parRow = document.createElement('tr');
parRow.innerHTML = '<td class="header">Par</td>';
for (let j = 1; j <= 18; j++) {
    parRow.innerHTML += '<td class="par" contenteditable="true"></td>';
    if (j === 9) parRow.innerHTML += '<td class="subtotal" id="outPar"></td>';
}
parRow.innerHTML += '<td class="subtotal" id="inPar"></td><td class="total" id="totalPar"></td>';
table.appendChild(parRow);

// Create score row
let scoreRow = document.createElement('tr');
scoreRow.innerHTML = '<td class="header">Score</td>';
for (let j = 1; j <= 18; j++) {
    scoreRow.innerHTML += '<td class="score" contenteditable="true"></td>';
    if (j === 9) scoreRow.innerHTML += '<td class="subtotal" id="outScore"></td>';
}
scoreRow.innerHTML += '<td class="subtotal" id="inScore"></td><td class="total" id="totalScore"></td>';
table.appendChild(scoreRow);

// Create fairway row
let fairwayRow = document.createElement('tr');
fairwayRow.innerHTML = '<td class="header">Fairway</td>';
for (let j = 1; j <= 18; j++) {
    fairwayRow.innerHTML += '<td class="stat fairway" contenteditable="true"></td>';
    if (j === 9) fairwayRow.innerHTML += '<td class="subtotal" id="outFairway"></td>';
}
fairwayRow.innerHTML += '<td class="subtotal" id="inFairway"></td><td class="total" id="totalFairway"></td>';
table.appendChild(fairwayRow);

// Create green row
let greenRow = document.createElement('tr');
greenRow.innerHTML = '<td class="header">Green</td>';
for (let j = 1; j <= 18; j++) {
    greenRow.innerHTML += '<td class="stat green" contenteditable="true"></td>';
    if (j === 9) greenRow.innerHTML += '<td class="subtotal" id="outGreen"></td>';
}
greenRow.innerHTML += '<td class="subtotal" id="inGreen"></td><td class="total" id="totalGreen"></td>';
table.appendChild(greenRow);

// Create save row
let saveRow = document.createElement('tr');
saveRow.innerHTML = '<td class="header">Save</td>';
for (let j = 1; j <= 18; j++) {
    saveRow.innerHTML += '<td class="stat save" contenteditable="true"></td>';
    if (j === 9) saveRow.innerHTML += '<td class="subtotal" id="outSavePercentage"></td>';
}
saveRow.innerHTML += '<td class="subtotal" id="inSavePercentage"></td><td class="total" id="totalSavePercentage"></td>';
table.appendChild(saveRow);

// Create putts row
let puttsRow = document.createElement('tr');
puttsRow.innerHTML = '<td class="header">Putts</td>';
for (let j = 1; j <= 18; j++) {
    puttsRow.innerHTML += '<td class="stat putts" contenteditable="true"></td>';
    if (j === 9) puttsRow.innerHTML += '<td class="subtotal" id="outPutts"></td>';
}
puttsRow.innerHTML += '<td class="subtotal" id="inPutts"></td><td class="total" id="totalPutts"></td>';
table.appendChild(puttsRow);

// Function to calculate totals and save percentages
function calculateTotals() {
    let outTotal = 0;
    let inTotal = 0;
    let outPutts = 0;
    let inPutts = 0;
    let outSaves = 0;
    let inSaves = 0;
    let outSaveAttempts = 0;
    let inSaveAttempts = 0;
    let scoreCells = table.rows[2].cells;
    let puttsCells = table.rows[6].cells;
    let saveCells = table.rows[5].cells;
    
    for (let j = 1; j <= 9; j++) {
        let score = parseInt(scoreCells[j].textContent);
        if (!isNaN(score)) outTotal += score;
        let putts = parseInt(puttsCells[j].textContent);
        if (!isNaN(putts)) outPutts += putts;
        let save = saveCells[j].textContent.toUpperCase();
        if (save === 'Y' || save === 'N') {
            outSaveAttempts++;
            if (save === 'Y') outSaves++;
        }
    }
    scoreCells[10].textContent = outTotal || '';
    puttsCells[10].textContent = outPutts || '';
    saveCells[10].textContent = outSaveAttempts > 0 ? `${outSaves}/${outSaveAttempts} (${Math.round((outSaves / outSaveAttempts) * 100)}%)` : '';

    for (let j = 11; j <= 19; j++) {
        let score = parseInt(scoreCells[j].textContent);
        if (!isNaN(score)) inTotal += score;
        let putts = parseInt(puttsCells[j].textContent);
        if (!isNaN(putts)) inPutts += putts;
        let save = saveCells[j].textContent.toUpperCase();
        if (save === 'Y' || save === 'N') {
            inSaveAttempts++;
            if (save === 'Y') inSaves++;
        }
    }
    scoreCells[20].textContent = inTotal || '';
    puttsCells[20].textContent = inPutts || '';
    saveCells[20].textContent = inSaveAttempts > 0 ? `${inSaves}/${inSaveAttempts} (${Math.round((inSaves / inSaveAttempts) * 100)}%)` : '';
    
    let totalScore = outTotal + inTotal;
    let totalPutts = outPutts + inPutts;
    let totalSaves = outSaves + inSaves;
    let totalSaveAttempts = outSaveAttempts + inSaveAttempts;
    scoreCells[21].textContent = totalScore || '';
    puttsCells[21].textContent = totalPutts || '';
    saveCells[21].textContent = totalSaveAttempts > 0 ? `${totalSaves}/${totalSaveAttempts} (${Math.round((totalSaves / totalSaveAttempts) * 100)}%)` : '';
}

// Function to calculate fairway and green percentages
function calculatePercentages() {
    let outFairway = 0;
    let inFairway = 0;
    let outGreen = 0;
    let inGreen = 0;
    let fairwayCells = table.rows[3].cells;
    let greenCells = table.rows[4].cells;
    
    for (let j = 1; j <= 9; j++) {
        if (fairwayCells[j].textContent.toUpperCase() === 'Y') outFairway++;
        if (greenCells[j].textContent.toUpperCase() === 'Y') outGreen++;
    }
    fairwayCells[10].textContent = `${outFairway} (${Math.round((outFairway / 9) * 100)}%)`;
    greenCells[10].textContent = `${outGreen} (${Math.round((outGreen / 9) * 100)}%)`;

    for (let j = 11; j <= 19; j++) {
        if (fairwayCells[j].textContent.toUpperCase() === 'Y') inFairway++;
        if (greenCells[j].textContent.toUpperCase() === 'Y') inGreen++;
    }
    fairwayCells[20].textContent = `${inFairway} (${Math.round((inFairway / 9) * 100)}%)`;
    greenCells[20].textContent = `${inGreen} (${Math.round((inGreen / 9) * 100)}%)`;
    
    let totalFairway = outFairway + inFairway;
    let totalGreen = outGreen + inGreen;
    fairwayCells[21].textContent = `${totalFairway} (${Math.round((totalFairway / 18) * 100)}%)`;
    greenCells[21].textContent = `${totalGreen}/18 (${Math.round((totalGreen / 18) * 100)}%)`;
}

// Function to calculate par totals
function calculateParTotals() {
    let outPar = 0;
    let inPar = 0;
    let parCells = table.rows[1].cells;
    
    for (let j = 1; j <= 9; j++) {
        let par = parseInt(parCells[j].textContent);
        if (!isNaN(par)) outPar += par;
    }
    parCells[10].textContent = outPar || '';

    for (let j = 11; j <= 19; j++) {
        let par = parseInt(parCells[j].textContent);
        if (!isNaN(par)) inPar += par;
    }
    parCells[20].textContent = inPar || '';
    
    let totalPar = outPar + inPar;
    parCells[21].textContent = totalPar || '';
}

// Event listener for input
table.addEventListener('input', function(e) {
    if (e.target.classList.contains('score') || e.target.classList.contains('putts') || e.target.classList.contains('par')) {
        e.target.textContent = e.target.textContent.replace(/[^0-9]/g, '').slice(0, 2);
    } else if (e.target.classList.contains('fairway') || e.target.classList.contains('green') || e.target.classList.contains('save')) {
        e.target.textContent = e.target.textContent.replace(/[^YyNn]/g, '').slice(0, 1).toUpperCase();
    }
    calculateTotals();
    calculatePercentages();
    calculateParTotals();
});

// ... (previous code for creating the table remains the same)

// Function to handle keydown events
function handleKeyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        let currentCell = e.target;
        let row = currentCell.parentElement;
        let col = Array.from(row.cells).indexOf(currentCell);
        let newRow, newCol;

        switch (e.key) {
            case 'ArrowRight':
                newRow = row;
                newCol = col + 1;
                break;
            case 'ArrowLeft':
                newRow = row;
                newCol = col - 1;
                break;
            case 'ArrowUp':
                newRow = row.previousElementSibling;
                newCol = col;
                break;
            case 'ArrowDown':
                newRow = row.nextElementSibling;
                newCol = col;
                break;
        }

        if (newRow && newCol >= 0 && newCol < row.cells.length) {
            let newCell = newRow.cells[newCol];
            if (newCell && newCell.contentEditable === 'true') {
                newCell.focus();
                // Place the cursor at the end of the content
                let range = document.createRange();
                range.selectNodeContents(newCell);
                range.collapse(false);
                let selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }
}

// Function to handle input
function handleInput(e) {
    let cell = e.target;
    let originalContent = cell.textContent;
    let newContent;

    if (cell.classList.contains('score') || cell.classList.contains('putts') || cell.classList.contains('par')) {
        newContent = originalContent.replace(/[^0-9]/g, '').slice(0, 2);
    } else if (cell.classList.contains('fairway') || cell.classList.contains('green') || cell.classList.contains('save')) {
        newContent = originalContent.replace(/[^YyNn]/g, '').slice(0, 1).toUpperCase();
    } else {
        return;
    }

    if (newContent !== originalContent) {
        cell.textContent = newContent;
        // Move cursor to end
        let range = document.createRange();
        range.selectNodeContents(cell);
        range.collapse(false);
        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    calculateTotals();
    calculatePercentages();
    calculateParTotals();
}

// Event listeners
table.addEventListener('keydown', handleKeyDown);
table.addEventListener('input', handleInput);

// Initial calculation
calculateTotals();
calculatePercentages();
calculateParTotals();

// Initial calculation
calculateTotals();
calculatePercentages();
calculateParTotals();