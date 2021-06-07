import {BinaryTree} from "./BinaryTree";
import {testTree} from "./testData";
import {TraverseType} from "./types";

const testNode = {value: 13, left: undefined, right: undefined};

describe("BinaryTree", () => {
    const tree = new BinaryTree(testTree);

    it('asserts set method sets a tree', () => {
        const tree = new BinaryTree(testTree);
        tree.setTree(testNode);
        expect(tree).toBeInstanceOf(BinaryTree);
    });

    it('asserts DFS inorder traverse', () => {
        const traversedTree = tree.traverse(TraverseType.INORDER);
        const inOrderTree = [1, 3, 4, 6, 7, 8, 10, 13, 14];
        expect(traversedTree).toEqual(inOrderTree);
    });

    it('asserts DFS preorder traverse', () => {
        const traversedTree = tree.traverse(TraverseType.PREORDER);
        const preOrderTree = [8, 3, 1, 6, 4, 7, 10, 14, 13];
        expect(traversedTree).toEqual(preOrderTree);
    });

    it('asserts DFS postorder traverse', () => {
        const traversedTree = tree.traverse(TraverseType.POSTORDER);
        const postOrderTree = [1, 4, 7, 6, 3, 13, 14, 10, 8];
        expect(traversedTree).toEqual(postOrderTree);
    });

    it('asserts BFS traverse', () => {
        const traversedTree = tree.traverse(TraverseType.BFS);
        const bfsTree = [8, 3, 10, 1, 6, 14, 4, 7, 13];
        expect(traversedTree).toEqual(bfsTree);
    });

    it('asserts getting the column values of a tree', () => {
        const column = tree.getColumn(1);
        const columnValues = [7, 10, 13];
        expect(column).toEqual(columnValues);
    });

})
