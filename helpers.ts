import { readFile } from 'node:fs/promises';

export function addUp(input: string[], getLineValue: (line: string, i?: number) => number) {
    return input.reduce((acc, line, i) => {
        return acc + getLineValue(line, i);
    }, 0);
}

export function range(start: number, end: number) {
    return Array(end - start).fill(null).map((_,i) => start + i);
}

export function fill<T>(value: T, length: number) {
    return Array(length).fill(null).map(() => value);
}

export async function run(func: (lines: string[]) => void, filename: string): Promise<void> {
    const input = await readFile(filename, 'utf-8');
    console.log(func(input.split('\n')));
}
