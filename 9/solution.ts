import { range, run } from '../helpers';

function aoc2024_9a(input: string[]) {
    const line = input[0].split('').map(Number);
    const numIds = Math.ceil(line.length / 2);
    let lineEndI = line.length - 1;
    let lineEndId = numIds - 1;
    let startBlocksLeft = 0;
    let endBlocksLeft = line[lineEndI];
    let diskMap: number[] = [];

    for (const [strI, n] of line.entries()) {
        const i = Number(strI);
        if (lineEndId <= i / 2) break;
        const isFile = i % 2 === 0;
        if (isFile) {
            const lineStartId = i / 2;
            range(0, n).forEach(() => {
                diskMap.push(lineStartId);
            })
        } else {
            if (startBlocksLeft === 0) startBlocksLeft = n;
            while (startBlocksLeft > 0) {
                if (lineEndId <= i / 2) break;
                const blocksToWrite = Math.min(startBlocksLeft, endBlocksLeft);
                range(0, blocksToWrite).forEach(() => {
                    diskMap.push(lineEndId);
                })
                startBlocksLeft -= blocksToWrite;
                endBlocksLeft -= blocksToWrite;
                if (endBlocksLeft === 0) {
                    lineEndI -= 2;
                    lineEndId = lineEndId - 1;
                    endBlocksLeft = line[lineEndI];
                }
            }
        }
    };
    range(0, endBlocksLeft).forEach(() => {
        diskMap.push(lineEndId);
    })
    return diskMap.reduce((acc, val, i) => acc + val * i, 0);
}

function aoc2024_9b(input: string[]) {
    const line = input[0].split('').map(Number);
    const insertions: Record<number, { oldI: number, i: number; id: number, size: number; }> = {};

    let diskMapI = 0;
    const emptySlots = line.reduce<Record<number, number[]>>((acc, n, i) => {
        if (i % 2) {
            if (!acc[n]) acc[n] = [];
            acc[n].push(diskMapI);
        }
        diskMapI += n;
        return acc;
    }, {});

    let currentId = 0;
    const diskMap = line.reduce<(number | null)[]>((acc, val, i) => {
        if (i % 2 === 0) {
            if (insertions[currentId]) {
                range(0, val).forEach(() => {
                    acc.push(null);
                });
            } else {
                range(0, val).forEach(() => {
                    acc.push(currentId);
                });
            }
            currentId += 1;
        } else {
            range(0, val).forEach(() => {
                acc.push(null);
            });
        }
        return acc;
    }, []);
    const totalLength = diskMap.length;

    const numIds = Math.ceil(line.length / 2);
    let lineEndId = numIds - 1;
    let lineEndNI = totalLength;
    for (const [i, endN] of [...line.entries()].toReversed()) {
        lineEndNI -= endN;
        const isFile = i % 2 === 0;
        if (isFile) {
            const leftmostSlots = range(endN, 10)
                .map(n => ({ size: n, i: emptySlots[n][0] }))
                .filter(({ i }) => i !== undefined && i < lineEndNI)
                .toSorted((a, b) => a.i - b.i);
            const leftmost = leftmostSlots[0];
            if (leftmost) {
                insertions[lineEndId] = ({ oldI: lineEndNI, i: leftmost.i, id: lineEndId, size: endN });
                emptySlots[leftmost.size].shift();
                const newSlotI = leftmost.i + endN;
                const newSlotSize = leftmost.size - endN;
                if (newSlotSize > 0) {
                    const spliceIndex = emptySlots[newSlotSize].findIndex(slotsI => slotsI > newSlotI);
                    if (spliceIndex >= 0) {
                        emptySlots[newSlotSize].splice(
                            spliceIndex,
                            0,
                            newSlotI
                        )
                    } else {
                        emptySlots[newSlotSize].push(newSlotI);
                    }
                }
            }
            lineEndId -= 1;
        }
    }

    Object.values(insertions).forEach(ins => {
        range(0, ins.size).forEach(i => {
            diskMap[ins.i + i] = ins.id;
            diskMap[ins.oldI + i] = null;
        });
    });
    return diskMap.reduce((acc, val, i) => acc + (val ?? 0) * i, 0);
}

(async () => {
    await run(aoc2024_9a, '9/input.txt');
    await run(aoc2024_9b, '9/input.txt');
})();
