import { addUp, range, run } from '../helpers';

function findTrailheads(input: string[]) {
    return input.flatMap((line, i) => {
        const zeros = line.matchAll(/0/g);
        return [...zeros].map<[number, number]>(z => [z.index, i]);
    });
}

function getNextSteps(currentStep: [number, number]): [number, number][] {
    return [
        [currentStep[0]-1, currentStep[1]],
        [currentStep[0]+1, currentStep[1]],
        [currentStep[0], currentStep[1]-1],
        [currentStep[0], currentStep[1]+1]
    ];
}

function findTrailEnds(input: string[], head: [number, number], accTrail: number[] = [0]): string[] {
    const nextNumber = accTrail.at(-1) + 1;
    if (nextNumber === 10) {
        return [`${head[0]}|${head[1]}`];
    }
    return getNextSteps(head).reduce<string[]>((acc, next) => {
        if (Number(input[next[1]]?.charAt(next[0])) === nextNumber) {
            return acc.concat(findTrailEnds(input, next, [...accTrail, nextNumber]));
        }
        return acc;
    }, []);
}

function findTrails(input: string[]) {
    const trails: Record<string, Record<string, number>> = {};
    findTrailheads(input).forEach(head => {
        const trailEnds = findTrailEnds(input, head);
        const headKey = `${head[0]}|${head[1]}`;
        trailEnds.forEach(end => {
            if (!trails[headKey]) trails[headKey] = {};
            if (!trails[headKey][end]) trails[headKey][end] = 0;
            trails[headKey][end] += 1;
        })
        return trails;
    }, {});
    return trails;
}

function aoc2024_10a(input: string[]) {
    const trails = findTrails(input);
    return Object.keys(trails).reduce((acc, head) => acc + Object.keys(trails[head]).length, 0);
}

function aoc2024_10b(input: string[]) {
    const trails = findTrails(input);
    return Object.keys(trails).reduce((acc, head) => {
        return acc + Object.values(trails[head]).reduce((acc, val) => acc + val, 0);
    }, 0);
}

(async () => {
    await run(aoc2024_10a, '10/input.txt');
    await run(aoc2024_10b, '10/input.txt');
})();
