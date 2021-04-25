import {TraverseType, TreeNode} from "./types";

export interface IBinaryTree<T> {

    setTree(value: TreeNode<T>): void,

    traverse(value: TraverseType): T[],

    getColumn(columnOrder: number): T[],
}

export class BinaryTree<T> implements IBinaryTree<T> {

    constructor(protected tree: TreeNode<T>) {}

    setTree = (value: TreeNode<T>): void => {
        this.tree = value
    }

    traverse = (value: TraverseType): T[] => {
        switch (value) {
            case TraverseType.INORDER:
                return this.traverseInOrder(this.tree)
            case TraverseType.PREORDER:
                return this.traversePreOrder(this.tree)
            case TraverseType.POSTORDER:
                return this.traversePostOrder(this.tree)
            case TraverseType.BFS:
                return this.traverseBFS(this.tree)
        }
    }

    getColumn = (columnOrder: number): T[] => {
        const result: T[] = [];
        const traverse = (node: TreeNode<T>, count: number): void => {
            if (count === columnOrder) {
                result.push(node.value)
            }
            if (node.left) {
                traverse(node.left, count - 1)
            }
            if (node.right) {
                traverse(node.right, count + 1)
            }
        }
        traverse(this.tree, 0)
        return result.sort((a, b) => +a - +b)
    }

    private traversePreOrder = (node: TreeNode<T>): T[] => {
        if (!node) return []
        return [node.value, ...this.traversePreOrder(node.left), ...this.traversePreOrder(node.right)]
    }

    private traverseInOrder = (node: TreeNode<T>): T[] => {
        if (!node) return []
        return [...this.traverseInOrder(node.left), node.value, ...this.traverseInOrder(node.right)]
    }

    private traversePostOrder = (node: TreeNode<T>): T[] => {
        if (!node) return []
        return [...this.traversePostOrder(node.left), ...this.traversePostOrder(node.right), node.value,]
    }

    private traverseBFS = (node: TreeNode<T>): T[] => {
        let queue = [node]
        const result: T[] = [];

        while (queue.length) {
            let current = queue.shift()
            result.push(current.value)

            if (current.left) {
                queue.push(current.left)
            }
            if (current.right) {
                queue.push(current.right)
            }
        }
        return result
    }
}
