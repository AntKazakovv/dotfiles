export function id(): string {
    let i: string;
    while (!i) {
        i = Math.random()
            .toString(36)
            .substring(2, 12);
    }
    return i;
}
