
export const interval = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms))

export const generateRandomArray = (length: number): number[] => {
    const arr = [];
    while (arr.length < length) {
        const item = Math.floor(Math.random() * (length * 1.3)) + 1;
        if (arr.indexOf(item) === -1) arr.push(item);
    }
    return arr
}

export const checkIfSorted = (array: number[]): boolean => {
    return array.every((item, index, array) => {
        if (index === array.length - 1) return true
        return item < array[index + 1]
    })
}
