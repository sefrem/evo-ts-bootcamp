import {BinaryTree, IBinaryTree} from "./BinaryTree";
import {TreeNode} from "./types";

interface IBinarySearchTree extends IBinaryTree<number> {
    has(value: number): boolean;
}

export class BinarySearchTree extends BinaryTree<number> implements IBinarySearchTree {

    has = (value: number): boolean => {
        const traverse = (node: TreeNode<number>): TreeNode<number> => {
            if (!node || node.value === value) {
                return node
            }
            if (value > node.value) {
                return traverse(node.right)
            }
            return traverse(node.left)
        }
        return !!traverse(this.tree)
    }

}

