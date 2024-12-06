import { addUp, run } from '../helpers';

function getInputs(input: string[]) {
    const splitPoint = input.findIndex(line => !line);
    return {
        rules: input.slice(0, splitPoint).reduce<Record<string, Record<string, boolean>>>((acc, val) => {
            const [before, after] = val.split('|');
            if (!acc[before]) acc[before] = {};
            acc[before][after] = true;
            return acc;
        }, {}),
        updates: input.slice(splitPoint + 1),
    };
}

function checkUpdateCorrectOrder(
    rules: Record<string, Record<string, boolean>>,
    update: string[]
) {
    const checkedPages: string[] = [];
    for (const page of update) {
        for (const checked of checkedPages) {
            if (rules[page][checked]) {
                return false;
            }
        }
        checkedPages.push(page);
    }
    return true;
}

function getMiddleNumber(
    update: string[]
) {
    return Number(update[Math.floor(update.length / 2)]);
}

function aoc2024_5a(input: string[]) {
    const { rules, updates } = getInputs(input);
    return addUp(updates, line => {
        const update = line.split(',');
        if (checkUpdateCorrectOrder(rules, update)) {
            return getMiddleNumber(update);
        }
        return 0;
    })
}

function aoc2024_5b(input: string[]) {
    const { rules, updates } = getInputs(input);
    return addUp(updates, line => {
        const update = line.split(',');
        if (checkUpdateCorrectOrder(rules, update)) {
            return 0;
        }
        const sorted = update.toSorted((a, b) => {
            if (rules[a][b]) return -1;
            if (rules[b][a]) return 1;
            return 0;
        });
        return getMiddleNumber(sorted);
    })
}

(async () => {
    await run(aoc2024_5a, '5/input.txt');
    await run(aoc2024_5b, '5/input.txt');
})();
