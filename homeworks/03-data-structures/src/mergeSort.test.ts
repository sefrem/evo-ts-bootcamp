import {mergeSort, compareFunction} from "./mergeSort";

const stringArray = ['19', '4', '43', '8', '6', '12', '21', '94', '6'];
const numberArray = [19, 4, 43, 8, 6, 12, 21, 94, 6];
const mixedArray = ['19', 4, '43', 8, undefined, 'unw', '6', '12', '21', '94', '6'];

describe('CompareFunction', () => {
    it('should work as JS array method sort', () => {
        const standardSort = mixedArray.sort();
        const customSort = mixedArray.sort(compareFunction);
        expect(standardSort).toEqual(customSort);
    })
})

describe('MergeSort', () => {

    it('should sort an array of string', () => {
        const sorted = mergeSort(stringArray, compareFunction);
        const expectedResult = ['12', '19', '21', '4',  '43', '6', '6',  '8',  '94'];
        expect(sorted).toEqual(expectedResult)
    });

    it('should sort an array of numbers', () => {
        const sorted = mergeSort(numberArray, compareFunction);
        const expectedResult = [12, 19, 21, 4, 43, 6, 6, 8, 94];
        expect(sorted).toEqual(expectedResult);
    });

})
