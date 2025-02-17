export function keysToUpper<T>(obj: Record<string, T>) {
    const objWithUpperCase : Record<string, T> = {}
    for (const key in obj) {
        objWithUpperCase[key.toUpperCase()] = obj[key]
    }
    return objWithUpperCase;
}