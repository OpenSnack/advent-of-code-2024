import { range, run } from '../helpers';

function buildAntennas(input: string[]) {
    return input.reduce<Record<string, string[]>>((acc, line, y) => {
        range(0, line.length).forEach(x => {
            const value = line[x];
            if (value !== '.') {
                if (!acc[value]) {
                    acc[value] = []
                }
                acc[value].push(`${x}|${y}`);
            }
        });
        return acc;
    }, {});
}

function getCombinations(values: string[]) {
    return values.reduce<[[number, number], [number, number]][]>((acc, val, valI) => {
        const numVal1 = val.split('|').map(Number) as [number, number];
        values.slice(valI + 1).forEach(nextVal => {
            const numVal2 = nextVal.split('|').map(Number) as [number, number];
            acc.push([numVal1, numVal2]);
        })
        return acc;
    }, []);
}

function checkWithinGrid(anti: [number, number], maxX: number, maxY: number) {
    return anti[0] >= 0 && anti[0] < maxX && anti[1] >= 0 && anti[1] < maxY;
}

function getPairAntinodes(
    ant1: [number, number],
    ant2: [number, number],
    maxX: number,
    maxY: number,
    limit = 1
) {
    const xDist = ant2[0] - ant1[0];
    const yDist = ant2[1] - ant1[1];
    const antinodes: string[] = [];
    let n = 0;
    while (n < limit) {
        let outside = false;
        const anti1: [number, number] = [ant1[0] + xDist * (n + 2), ant1[1] + yDist * (n + 2)];
        if (checkWithinGrid(anti1, maxX, maxY)) {
            antinodes.push(`${anti1[0]}|${anti1[1]}`);
        } else {
            outside = true;
        }
        const anti2: [number, number] = [ant1[0] - xDist * (n + 1), ant1[1] - yDist * (n + 1)];
        if (checkWithinGrid(anti2, maxX, maxY)) {
            antinodes.push(`${anti2[0]}|${anti2[1]}`);
        } else if (outside) {
            return antinodes;
        }
        n += 1;
    }
    return antinodes;
}

function getAntinodes(input: string[], limit: number, includeSelf: boolean) {
    const antinodes = new Set<string>();
    const antennas = buildAntennas(input);
    Object.values(antennas).forEach(ants => {
        getCombinations(ants).forEach(([ant1, ant2]) => {
            if (includeSelf) {
                antinodes.add(`${ant1[0]}|${ant1[1]}`);
                antinodes.add(`${ant2[0]}|${ant2[1]}`);
            }
            getPairAntinodes(ant1, ant2, input[0].length, input.length, limit).forEach(anti => {
                antinodes.add(anti);
            })
        });
    });
    return antinodes.size;
}

function aoc2024_8a(input: string[]) {
    return getAntinodes(input, 1, false);
}

function aoc2024_8b(input: string[]) {
    return getAntinodes(input, Infinity, true);
}

(async () => {
    await run(aoc2024_8a, '8/input.txt');
    await run(aoc2024_8b, '8/input.txt');
})();
