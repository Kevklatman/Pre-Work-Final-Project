// Create the table element
let table = document.createElement('table');

// Create table header (Hole numbers)
let headerRow = document.createElement('tr');
headerRow.innerHTML = '<th>Hole</th>';
for (let i = 1; i <= 9; i++) {
    headerRow.innerHTML += `<th>${i}</th>`;
}
headerRow.innerHTML += '<th>Out</th>';
for (let i = 10; i <= 18; i++) {
    headerRow.innerHTML += `<th>${i}</th>`;
}
headerRow.innerHTML += '<th>In</th><th>Total</th>';
table.appendChild(headerRow);

// Create par row
let parRow = document.createElement('tr');
parRow.innerHTML = '<td class="header">Par</td>';
let parValues = [4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4];
let frontNinePar = 0;
let backNinePar = 0;
parValues.forEach((par, index) => {
    parRow.innerHTML += `<td class="par">${par}</td>`;
    if (index < 9) {
        frontNinePar += par;
        if (index === 8) {
            parRow.innerHTML += `<td class="par subtotal">${frontNinePar}</td>`;
        }
    } else {
        backNinePar += par;
    }
});
parRow.innerHTML += `<td class="par subtotal">${backNinePar}</td><td class="par total">${frontNinePar + backNinePar}</td>`;
table.appendChild(parRow);

// Create row for the player
let playerRow = document.createElement('tr');
playerRow.innerHTML = '<td class="header">Score</td>';
for (let j = 1; j <= 9; j++) {
    playerRow.innerHTML += '<td class="score" contenteditable="true"></td>';
}
playerRow.innerHTML += '<td class="subtotal" id="outScore"></td>';
for (let j = 10; j <= 18; j++) {
    playerRow.innerHTML += '<td class="score" contenteditable="true"></td>';
}
playerRow.innerHTML += '<td class="subtotal" id="inScore"></td><td class="total" id="totalScore"></td>';
table.appendChild(playerRow);

// Create fairway row
let fairwayRow = document.createElement('tr');
fairwayRow.innerHTML = '<td class="header">Fairway</td>';
for (let j = 1; j <= 18; j++) {
    fairwayRow.innerHTML += '<td class="stat fairway" contenteditable="true"></td>';
    if (j === 9) fairwayRow.innerHTML += '<td></td>'; // Empty cell for Out
}
fairwayRow.innerHTML += '<td></td><td></td>'; // Empty cells for In and Total
table.appendChild(fairwayRow);

// Create green row
let greenRow = document.createElement('tr');
greenRow.innerHTML = '<td class="header">Green</td>';
for (let j = 1; j <= 18; j++) {
    greenRow.innerHTML += '<td class="stat green" contenteditable="true"></td>';
    if (j === 9) greenRow.innerHTML += '<td></td>'; // Empty cell for Out
}
greenRow.innerHTML += '<td></td><td></td>'; // Empty cells for In and Total
table.appendChild(greenRow);

// Create save row
let saveRow = document.createElement('tr');
saveRow.innerHTML = '<td class="header">Save</td>';
for (let j = 1; j <= 18; j++) {
    saveRow.innerHTML += '<td class="stat save" contenteditable="true"></td>';
    if (j === 9) saveRow.innerHTML += '<td></td>'; // Empty cell for Out
}
saveRow.innerHTML += '<td></td><td></td>'; // Empty cells for In and Total
table.appendChild(saveRow);

// Create putts row
let puttsRow = document.createElement('tr');
puttsRow.innerHTML = '<td class="header">Putts</td>';
for (let j = 1; j <= 9; j++) {
    puttsRow.innerHTML += '<td class="stat putts" contenteditable="true"></td>';
}
puttsRow.innerHTML += '<td class="subtotal" id="outPutts"></td>';
for (let j = 10; j <= 18; j++) {
    puttsRow.innerHTML += '<td class="stat putts" contenteditable="true"></td>';
}
puttsRow.innerHTML += '<td class="subtotal" id="inPutts"></td><td class="total" id="totalPutts"></td>';
table.appendChild(puttsRow);

// Append the table to the body
document.body.appendChild(table);

// Function to calculate totals
function calculateTotals() {
    let outTotal = 0;
    let inTotal = 0;
    let outPutts = 0;
    let inPutts = 0;
    let scoreCells = table.rows[2].cells;
    let puttsCells = table.rows[6].cells;
    
    for (let j = 1; j <= 9; j++) {
        let score = parseInt(scoreCells[j].textContent);
        if (!isNaN(score)) outTotal += score;
        let putts = parseInt(puttsCells[j].textContent);
        if (!isNaN(putts)) outPutts += putts;
    }
    scoreCells[10].textContent = outTotal || '';
    puttsCells[10].textContent = outPutts || '';

    for (let j = 11; j <= 19; j++) {
        let score = parseInt(scoreCells[j].textContent);
        if (!isNaN(score)) inTotal += score;
        let putts = parseInt(puttsCells[j].textContent);
        if (!isNaN(putts)) inPutts += putts;
    }
    scoreCells[20].textContent = inTotal || '';
    puttsCells[20].textContent = inPutts || '';
    
    let totalScore = outTotal + inTotal;
    let totalPutts = outPutts + inPutts;
    scoreCells[21].textContent = totalScore || '';
    puttsCells[21].textContent = totalPutts || '';
}

// Function to get the next editable cell
function getNextEditableCell(currentCell, direction) {
    let row = currentCell.parentElement;
    let cellIndex = currentCell.cellIndex;
    let rowIndex = row.rowIndex;

    switch (direction) {
        case 'ArrowRight':
            while (row) {
                while (cellIndex < row.cells.length - 1) {
                    cellIndex++;
                    if (row.cells[cellIndex].classList.contains('score') || row.cells[cellIndex].classList.contains('stat')) {
                        return row.cells[cellIndex];
                    }
                }
                row = row.nextElementSibling;
                cellIndex = 0;
            }
            break;
        case 'ArrowLeft':
            while (row) {
                while (cellIndex > 0) {
                    cellIndex--;
                    if (row.cells[cellIndex].classList.contains('score') || row.cells[cellIndex].classList.contains('stat')) {
                        return row.cells[cellIndex];
                    }
                }
                row = row.previousElementSibling;
                cellIndex = row ? row.cells.length - 1 : 0;
            }
            break;
        case 'ArrowDown':
            while (rowIndex < table.rows.length - 1) {
                rowIndex++;
                let cell = table.rows[rowIndex].cells[cellIndex];
                if (cell.classList.contains('score') || cell.classList.contains('stat')) {
                    return cell;
                }
            }
            break;
        case 'ArrowUp':
            while (rowIndex > 1) {
                rowIndex--;
                let cell = table.rows[rowIndex].cells[cellIndex];
                if (cell.classList.contains('score') || cell.classList.contains('stat')) {
                    return cell;
                }
            }
            break;
    }
    return null;
}

// Handle keydown events for navigation and data entry
table.addEventListener('keydown', function(e) {
    if (e.target.classList.contains('score') || e.target.classList.contains('stat')) {
        if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
            let nextCell = getNextEditableCell(e.target, e.key);
            if (nextCell) {
                nextCell.focus();
                // Place the cursor at the end of the content
                let range = document.createRange();
                let sel = window.getSelection();
                range.selectNodeContents(nextCell);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            let nextCell = getNextEditableCell(e.target, 'ArrowRight');
            if (nextCell) {
                nextCell.focus();
            }
        }
    }
});

// Limit input based on cell type
table.addEventListener('input', function(e) {
    if (e.target.classList.contains('score') || e.target.classList.contains('putts')) {
        e.target.textContent = e.target.textContent.replace(/[^0-9]/g, '').slice(0, 2);
    } else if (e.target.classList.contains('fairway') || e.target.classList.contains('green') || e.target.classList.contains('save')) {
        e.target.textContent = e.target.textContent.replace(/[^YyNn]/g, '').slice(0, 1).toUpperCase();
    }
    if (e.target.classList.contains('score') || e.target.classList.contains('putts')) {
        calculateTotals();
    }
});

// Initial calculation
calculateTotals();