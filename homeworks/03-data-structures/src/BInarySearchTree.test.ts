import {BinarySearchTree} from "./BinarySearchTree";
import {testTree} from "./testData";

describe('BinarySearchTree', () => {
    const tree = new BinarySearchTree(testTree);

    it('asserts the search of the tree to return true if the value exists in the tree', () => {
        const response = tree.has(4);
        expect(response).toBe(true);
    });

    it('asserts the search of the tree to return false if the value doesnt exist in the tree', () => {
        const response = tree.has(41);
        expect(response).toBe(false);
    });

})
