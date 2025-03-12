export function keysToUpper<T>(obj: Record<string, T>) {
    const objWithUpperCase : Record<string, T> = {}
    for (const key in obj) {
        objWithUpperCase[key.toUpperCase()] = obj[key]
    }
    return objWithUpperCase;
}

export function notPrimitive(object) {
    return typeof object === "object" && object !== null;
}
export function isPrimitive(object) {
    return typeof object !== "object" || object === null;
}