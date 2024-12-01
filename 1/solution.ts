import { run } from '../helpers';

function aoc2024_1a(input: string[]) {
    const lines = input.map(line => line.split('   '));
    const locs1 = lines.map(line => Number(line[0])).toSorted();
    const locs2 = lines.map(line => Number(line[1])).toSorted();
    return locs1.map((l, i) => Math.abs(l - locs2[i])).reduce((acc, val) => acc + val, 0)
}

function aoc2024_1b(input: string[]) {
    const lines = input.map(line => line.split('   '));
    const locs1 = lines.map(line => Number(line[0]));
    const locs2 = lines.map(line => Number(line[1]))
        .reduce<Record<number, number>>((acc, val) => {
            if (acc[val]) {
                acc[val] += 1
            } else {
                acc[val] = 1
            }
            return acc;
        }, {});
    return locs1.reduce((acc, val) => acc + Number(val) * (locs2[val] ?? 0), 0);
}

(async () => {
    await run(aoc2024_1a, '1/input.txt');
    await run(aoc2024_1b, '1/input.txt');
})();