export interface TreeNode<T> {
    value: T,
    left?: TreeNode<T>,
    right?: TreeNode<T>,
}

export enum TraverseType {
    INORDER = 'inorder',
    PREORDER = 'preorder',
    POSTORDER = 'postorder',
    BFS = 'bfs',
}
