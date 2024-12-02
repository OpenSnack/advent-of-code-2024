import { addUp, range, run } from '../helpers';

function findUnsafeLevel(nums: number[]) {
    let diff = 0;
    for (const [i, num] of Object.entries(nums.slice(1))) {
        const newDiff = num - (nums[Number(i)] ?? 0);
        if (
            (Number(i) !== 0 && Math.sign(newDiff) !== Math.sign(diff))
            || Math.abs(newDiff) > 3
            || Math.abs(newDiff) < 1
        ) return Number(i) + 1;
        diff = newDiff;
    }
    return -1;
}

function aoc2024_2a(input: string[]) {
    return addUp(input, line => {
        const nums = line.split(' ').map(Number);
        return findUnsafeLevel(nums) > -1 ? 0 : 1;
    });
}

function aoc2024_2b(input: string[]) {
    return addUp(input, line => {
        const nums = line.split(' ').map(Number);
        const unsafeLevel = findUnsafeLevel(nums);
        if (unsafeLevel > -1) {
            // only have to check from the found unsafeLevel backwards
            if (range(0, unsafeLevel + 1).every(n => findUnsafeLevel(nums.toSpliced(n, 1)) > -1)) {
                return 0;
            }
        }
        return 1;
    });
}

(async () => {
    await run(aoc2024_2a, '2/input.txt');
    await run(aoc2024_2b, '2/input.txt');
})();
