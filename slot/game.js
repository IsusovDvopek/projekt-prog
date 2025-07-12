// Weighted symbol pool (RTP realism)
const symbolPool = [
  { symbol: '🍒', weight: 25, payout: 1 },
  { symbol: '🍋', weight: 25, payout: 2 },
  { symbol: '🍇', weight: 20, payout: 5 },
  { symbol: '🍉', weight: 15, payout: 10 },
  { symbol: '💎', weight: 10, payout: 20 }
];

const rows = 5;
const cols = 6;
let grid = [];

let tumbleCount = 0;
const maxTumbles = 5;
let totalWin = 0;

function getRandomSymbol() {
  const weightedList = [];
  symbolPool.forEach(obj => {
    for (let i = 0; i < obj.weight; i++) {
      weightedList.push(obj.symbol);
    }
  });
  return weightedList[Math.floor(Math.random() * weightedList.length)];
}

function getPayout(symbol, count) {
  const symbolObj = symbolPool.find(s => s.symbol === symbol);
  if (!symbolObj) return 0;
  return symbolObj.payout * count;
}

function createGrid() {
  grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(getRandomSymbol());
    }
    grid.push(row);
  }
}

function renderGrid() {
  const gridContainer = document.getElementById('grid');
  gridContainer.innerHTML = '';
  grid.flat().forEach(symbol => {
    const div = document.createElement('div');
    div.className = 'symbol';
    div.textContent = symbol;
    gridContainer.appendChild(div);
  });
}

function spin() {
  tumbleCount = 0;
  totalWin = 0;
  createGrid();
  renderGrid();
  setTimeout(() => handleTumble(), 300);
}

function handleTumble() {
  const flat = grid.flat();
  const count = {};
  flat.forEach(s => count[s] = (count[s] || 0) + 1);

  let matchedSymbol = null;
  let matchedCount = 0;
  for (const [symbol, cnt] of Object.entries(count)) {
    if (cnt >= 8) {
      matchedSymbol = symbol;
      matchedCount = cnt;
      break;
    }
  }

  if (!matchedSymbol || tumbleCount >= maxTumbles) {
    const resultText =
      totalWin > 0
        ? `🎉 Total Win: ${totalWin} coins!`
        : 'No win. Try again!';
    document.getElementById('result').textContent = resultText;
    return;
  }

  tumbleCount++;
  const win = getPayout(matchedSymbol, matchedCount);
  totalWin += win;

  // Remove matched symbols
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === matchedSymbol) {
        grid[r][c] = null;
      }
    }
  }

  tumbleGrid();
  renderGrid();
  document.getElementById('result').textContent = `💥 Matched ${matchedCount} ${matchedSymbol}s! +${win} coins`;

  setTimeout(() => handleTumble(), 400);
}

function tumbleGrid() {
  for (let c = 0; c < cols; c++) {
    let column = [];
    for (let r = rows - 1; r >= 0; r--) {
      if (grid[r][c]) column.push(grid[r][c]);
    }
    while (column.length < rows) {
      column.push(getRandomSymbol());
    }
    for (let r = rows - 1; r >= 0; r--) {
      grid[r][c] = column[rows - 1 - r];
    }
  }
}
