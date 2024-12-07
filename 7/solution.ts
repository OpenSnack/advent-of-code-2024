import { addUp, run } from '../helpers';

function addOp(accResult: number, operand: number) {
    return accResult + operand;
}

function multOp(accResult: number, operand: number) {
    if (!accResult) return false;
    return accResult * operand;
}

function concatOp(accResult: number, operand: number) {
    if (!accResult) return operand;
    return Number(`${String(accResult)}${String(operand)}`);
}

function writeEquation(accEquation: string, op: string, operand: number) {
    if (!accEquation) return `${operand}`;
    return `${accEquation} ${op} ${operand}`;
}

type Operation = {
    op: (acc: number, operand: number) => number | false;
    writer: (acc: string, operand: number) => string;
}

const opsA: Operation[] = [
    {
        op: addOp,
        writer: (acc: string, operand: number) => writeEquation(acc, '+', operand)
    },
    {
        op: multOp,
        writer: (acc: string, operand: number) => writeEquation(acc, '*', operand)
    },
];

const opsB = [
    ...opsA,
    {
        op: concatOp,
        writer: (acc: string, operand: number) => writeEquation(acc, '||', operand)
    }
]

function checkEquation(
    operands: number[],
    result: number,
    ops: Operation[],
    accResult: number | false = 0,
    accEquation = ''
): string | false {
    if (accResult === false) return false;
    if (operands.length === 0) {
        return accResult === result ? accEquation : false;
    }
    for (const op of ops) {
        const equation = checkEquation(
            operands.slice(1),
            result,
            ops,
            op.op(accResult, operands[0]),
            op.writer(accEquation, operands[0])
        );
        if (equation) return equation;
    }
    return false;
}

function calibrate(input: string[], ops: Operation[]) {
    return addUp(input, line => {
        const [result, rawOperands] = line.split(': ');
        const operands = rawOperands.split(' ').map(Number);
        const found = checkEquation(operands, Number(result), ops);
        // if (found) console.log(`line ${lineI + 1}: ${found} = ${result}`);
        return found ? Number(result) : 0;
    });
}

function aoc2024_7a(input: string[]) {
    return calibrate(input, opsA)
}

function aoc2024_7b(input: string[]) {
    return calibrate(input, opsB);
}

(async () => {
    await run(aoc2024_7a, '7/input.txt');
    await run(aoc2024_7b, '7/input.txt');
})();