// Create the table element
let table = document.createElement('table');

// Create table header (Hole numbers)
let headerRow = document.createElement('tr');
headerRow.innerHTML = '<th>Hole</th>';
for (let i = 1; i <= 18; i++) {
    let th = document.createElement('th');
    th.textContent = i;
    headerRow.appendChild(th);
}
headerRow.innerHTML += '<th>Out</th><th>In</th><th>Total</th>';
table.appendChild(headerRow);

// Create par row
let parRow = document.createElement('tr');
parRow.innerHTML = '<td class="header">Par</td>';
let parValues = [4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4];
let frontNinePar = 0;
let backNinePar = 0;
parValues.forEach((par, index) => {
    let td = document.createElement('td');
    td.textContent = par;
    td.className = 'par';
    parRow.appendChild(td);
    if (index < 9) frontNinePar += par;
    else backNinePar += par;
});
parRow.innerHTML += `<td class="par subtotal">${frontNinePar}</td><td class="par subtotal">${backNinePar}</td><td class="par total">${frontNinePar + backNinePar}</td>`;
table.appendChild(parRow);

// Create rows for players
for (let i = 1; i <= 4; i++) {
    let playerRow = document.createElement('tr');
    playerRow.innerHTML = `<td class="header">Player ${i}</td>`;
    for (let j = 1; j <= 18; j++) {
        let td = document.createElement('td');
        td.contentEditable = true;
        td.className = 'score';
        playerRow.appendChild(td);
    }
    playerRow.innerHTML += `<td class="subtotal" id="outPlayer${i}"></td><td class="subtotal" id="inPlayer${i}"></td><td class="total" id="totalPlayer${i}"></td>`;
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
        
        for (let j = 1; j <= 18; j++) {
            let score = parseInt(playerCells[j].textContent);
            if (!isNaN(score)) {
                if (j <= 9) outTotal += score;
                else inTotal += score;
            }
        }
        
        let totalScore = outTotal + inTotal;
        playerCells[19].textContent = outTotal || '';
        playerCells[20].textContent = inTotal || '';
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