export function roundUpToXDigits(num: number | string, digits = 2) {
    if (typeof num === 'string') {
        num = parseFloat(num);
    }
    const multiplier = Math.pow(10, digits);
    return Math.ceil(num * multiplier) / multiplier;
}