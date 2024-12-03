import { addUp, run } from '../helpers';

const matchMulCapture = /mul\((\d{1,3}),(\d{1,3})\)/g;
const matchMulDoDont = /mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/g;

function aoc2024_3a(input: string[]) {
    return addUp(input, line => {
        const validInstructions = [...line.matchAll(matchMulCapture)];
        return validInstructions.reduce((acc, val) => acc + (Number(val[1]) * Number(val[2])), 0)
    });
}

function aoc2024_3b(input: string[]) {
    let dont = false;
    return addUp(input, line => {
        const validInstructions = [...line.matchAll(matchMulDoDont)];
        return validInstructions.reduce((acc, val) => {
            let add = 0
            if (val[0] === 'don\'t()') {
                dont = true
            } else if (val[0] === 'do()') {
                dont = false;
            } else if (!dont) {
                const validMult = [...val[0].matchAll(matchMulCapture)][0];
                add = (Number(validMult[1]) * Number(validMult[2]))
            }
            return acc + add;
        }, 0)
    });
}

(async () => {
    await run(aoc2024_3a, '3/input.txt');
    await run(aoc2024_3b, '3/input.txt');
})();
