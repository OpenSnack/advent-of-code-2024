import { range, run } from '../helpers';

function getSubstring(
    input: string[],
    length: number,
    x: number,
    y: number,
    dx: number,
    dy: number
) {
    const startX = dx < 0 ? x + length - 1 : x;
    return range(0, length)
        .map(n => `${input[y + dy * n].at(startX + dx * n)}`)
        .join('');
}

function addUpSubstringsInDirection(
    input: string[],
    target: string,
    dx: -1 | 0 | 1,
    dy: 0 | 1,
) {
    let sum = 0;
    input.slice(0, dy ? -(target.length - 1) : Infinity).forEach((line, lineI) => {
        range(0, line.length - (dx ? target.length - 1 : 0)).forEach(start => {
            const substr = getSubstring(input, target.length, start, lineI, dx, dy);
            if (substr === 'XMAS') {
                sum += 1;
            }
            if (substr === 'SAMX') {
                sum += 1;
            }
        });
    });
    return sum;
}

function aoc2024_4a(input: string[]) {
    return addUpSubstringsInDirection(input, 'XMAS', 1, 0) // horizontal
        + addUpSubstringsInDirection(input, 'XMAS', 0, 1) // vertical
        + addUpSubstringsInDirection(input, 'XMAS', 1, 1) // diagonal ltr
        + addUpSubstringsInDirection(input, 'XMAS', -1, 1); // diagonal rtl
}

function aoc2024_4b(input: string[]) {
    let sum = 0;
    input.slice(0, -2).forEach((line, lineI) => {
        range(0, line.length - 2).forEach(start => {
            const substr1 = getSubstring(input, 3, start, lineI, 1, 1);
            const substr2 = getSubstring(input, 3, start, lineI, -1, 1);
            if (substr1 === 'MAS' || substr1 === 'SAM') {
                if (substr2 === 'MAS' || substr2 === 'SAM') {
                    sum += 1;
                }
            }
        })
    })
    return sum;
}

(async () => {
    await run(aoc2024_4a, '4/input.txt');
    await run(aoc2024_4b, '4/input.txt');
})();
