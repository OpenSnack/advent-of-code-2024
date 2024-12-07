import { run } from '../helpers';

function getGuardPosition(input: string[]): [number, number] {
    let guardPosX = -1;
    let guardPosY = input.findIndex(line => {
        const guardCell = line.search(/\^/);
        if (guardCell >= 0) {
            guardPosX = guardCell;
            return true;
        }
        return false;
    });
    return [guardPosX, guardPosY];
}

function turn(dx: number, dy: number) {
    if (dx > 0) {
        return [0, 1];
    }
    if (dx < 0) {
        return [0, -1];
    }
    if (dy > 0) {
        return [-1, 0];
    }
    return [1, 0];
}

function addObstacle(input: string[], x: number, y: number) {
    return input.map((line, lineY) => {
        if (lineY === y) return line.substring(0, x) + '#' + line.substring(x + 1);
        return line;
    });
}

function printVisualOutput(
    input: string[],
    startPos: [number, number],
    cells: Set<string>,
    obstacle?: [number, number]
) {
    const visualOutput = input.map((line, lineY) => line.split('').map((cell, lineX) => {
        if (lineX === startPos[0] && lineY === startPos[1]) return '^';
        if (lineX === obstacle?.[0] && lineY === obstacle?.[1]) return 'O';
        if (cells.has(`${lineX}|${lineY}`)) return 'X';
        return cell;
    }).join(''));
    visualOutput.forEach(line => console.log(line));
}

function getVisitedCells(input: string[], startPos: [number, number]) {
    const gridHeight = input.length;
    const gridWidth = input[0].length;
    let x = startPos[0];
    let y = startPos[1];

    let dx = 0;
    let dy = -1;
    // let cells = new Set([`${x}|${y}`]);
    let uniqueCells = new Set([`${x}|${y}`]);
    let directionalCells = new Set([`${x}|${y}|${dx}|${dy}`]);
    while (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
        const nextX = x + dx;
        const nextY = y + dy;
        const nextCell = input[nextY]?.[nextX];
        if (nextCell && directionalCells.has(`${nextX}|${nextY}|${dx}|${dy}`)) {
            return {
                uniqueCells,
                directionalCells,
                loop: true
            };
        }
        if (nextCell && nextCell !== '#') {
            uniqueCells.add(`${nextX}|${nextY}`);
            directionalCells.add(`${nextX}|${nextY}|${dx}|${dy}`);
            x = nextX;
            y = nextY;
        } else if (nextCell === '#') {
            const newD = turn(dx, dy);
            dx = newD[0];
            dy = newD[1];
            directionalCells.add(`${x}|${y}|${dx}|${dy}`);
        } else {
            x = nextX;
            y = nextY;
        }
    }
    
    return {
        uniqueCells,
        directionalCells,
        loop: false
    };
}


function aoc2024_6a(input: string[]) {
    const startPos = getGuardPosition(input);
    const cells = getVisitedCells(input, startPos);
    // printVisualOutput(input, startPos, squares);
    return cells.uniqueCells.size;
}

function aoc2024_6b(input: string[]) {
    const startPos = getGuardPosition(input);
    const cells = getVisitedCells(input, startPos);
    let positions = new Set<string>();
    cells.uniqueCells.forEach(cell => {
        if (cell === `${startPos[0]}|${startPos[1]}`) return;
        const [cellX, cellY] = cell.split('|').map(Number);
        const newGrid = addObstacle(input, cellX, cellY);
        if (getVisitedCells(newGrid, startPos).loop) {
            positions.add(cell);
        };
    });
    // const [x, y] = [...positions.values()][0].split('|').map(Number);
    // const newGrid = addObstacle(input, x, y);
    // printVisualOutput(newGrid, startPos, getVisitedCells(newGrid, startPos).uniqueCells, [x, y]);
    return positions.size;
}

(async () => {
    await run(aoc2024_6a, '6/input.txt');
    await run(aoc2024_6b, '6/input.txt');
})();
