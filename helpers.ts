import { readFile } from 'node:fs/promises';

export async function run(func: (lines: string[]) => void, filename: string): Promise<void> {
    const input = await readFile(filename, 'utf-8');
    console.log(func(input.split('\n')));
}
