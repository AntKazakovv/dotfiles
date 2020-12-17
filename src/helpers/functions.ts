export function isNegative(num: number): boolean {
    return !(1 + Math.sign(num));
}

export function putInRange(num: number, start: number, end?: number): number {
    const min = Math.max(num, start);
    return Number.isFinite(end) ? Math.min(min, end) : min;
}
