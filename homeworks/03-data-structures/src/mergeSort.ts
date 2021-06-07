type CompareFunction<T> = {
    (a: T, b: T): number
}

export function compareFunction<T>(a: T, b: T): number {
    const stringA = '' + a;
    const stringB = '' + b;

    if (stringA < stringB) return -1
    if (stringA > stringB) return 1
    return 0
}


export function mergeSort<T>(array: T[], compareFunction: CompareFunction<T>): T[] {

    function merge(left: T[], right: T[],): T[] {
        let arr = []

        while (left.length && right.length) {
            if (compareFunction(left[0], right[0]) === -1) {
                arr.push(left.shift())
            } else {
                arr.push(right.shift())
            }
        }

        return [...arr, ...left, ...right]
    }

    function divide(array: T[]): T[] {
        if (array.length < 2) {
            return array
        }
        const leftHalf = array.splice(0, array.length / 2)
        return merge(divide(leftHalf), divide(array))
    }

    return divide(array)

}
