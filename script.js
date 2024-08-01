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

// Create rows for players
for (let i = 1; i <= 4; i++) {
    let playerRow = document.createElement('tr');
    playerRow.innerHTML = `<td class="header">Player ${i}</td>`;
    for (let j = 1; j <= 9; j++) {
        playerRow.innerHTML += `<td class="score" contenteditable="true"></td>`;
    }
    playerRow.innerHTML += `<td class="subtotal" id="outPlayer${i}"></td>`;
    for (let j = 10; j <= 18; j++) {
        playerRow.innerHTML += `<td class="score" contenteditable="true"></td>`;
    }
    playerRow.innerHTML += `<td class="subtotal" id="inPlayer${i}"></td><td class="total" id="totalPlayer${i}"></td>`;
    table.appendChild(playerRow);
}

// Append the table to the body
document.body.appendChild(table);

// Function to calculate totals
function calculateTotals() {
    for (let i = 1; i <= 4; i++) {
        let outTotal = 0;
        let inTotal = 0;
        let playerCells = table.rows[i + 1].cells;
        
        for (let j = 1; j <= 9; j++) {
            let score = parseInt(playerCells[j].textContent);
            if (!isNaN(score)) outTotal += score;
        }
        playerCells[10].textContent = outTotal || '';

        for (let j = 11; j <= 19; j++) {
            let score = parseInt(playerCells[j].textContent);
            if (!isNaN(score)) inTotal += score;
        }
        playerCells[20].textContent = inTotal || '';
        
        let totalScore = outTotal + inTotal;
        playerCells[21].textContent = totalScore || '';
    }
}

// Add event listener to recalculate totals when scores change
table.addEventListener('input', calculateTotals);

// Prevent newline on Enter key and move to next cell
table.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        let currentCell = e.target;
        let currentRow = currentCell.parentElement;
        let nextCell = currentCell.nextElementSibling;
        
        if (nextCell && nextCell.classList.contains('score')) {
            nextCell.focus();
        } else if (currentRow.nextElementSibling) {
            let nextRow = currentRow.nextElementSibling;
            let firstScoreCell = nextRow.querySelector('.score');
            if (firstScoreCell) {
                firstScoreCell.focus();
            }
        }
    }
});

// Limit input to 1 or 2 digits
table.addEventListener('input', function(e) {
    if (e.target.classList.contains('score')) {
        e.target.textContent = e.target.textContent.replace(/[^0-9]/g, '').slice(0, 2);
    }
});

// ... (previous code remains the same until the event listeners)

// Function to calculate totals
function calculateTotals() {
    // ... (calculation logic remains the same)
}

// Add event listener to recalculate totals when scores change
table.addEventListener('input', calculateTotals);

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
                    if (row.cells[cellIndex].classList.contains('score')) {
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
                    if (row.cells[cellIndex].classList.contains('score')) {
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
                if (cell.classList.contains('score')) {
                    return cell;
                }
            }
            break;
        case 'ArrowUp':
            while (rowIndex > 1) {
                rowIndex--;
                let cell = table.rows[rowIndex].cells[cellIndex];
                if (cell.classList.contains('score')) {
                    return cell;
                }
            }
            break;
    }
    return null;
}

// Handle keydown events for navigation and data entry
table.addEventListener('keydown', function(e) {
    if (e.target.classList.contains('score')) {
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

// Limit input to 1 or 2 digits
table.addEventListener('input', function(e) {
    if (e.target.classList.contains('score')) {
        e.target.textContent = e.target.textContent.replace(/[^0-9]/g, '').slice(0, 2);
    }
});

// Initial calculation
calculateTotals();