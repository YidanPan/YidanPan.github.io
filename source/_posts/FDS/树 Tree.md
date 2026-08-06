>[!note] 核心知识
> - 树的表示法：first-child-next-sibling
> - 二叉树
>	- 性质
>	- 树的遍历：前、中、后、层
>	- 线索二叉树
>	- 应用：文件系统、表达式树
> - **二叉搜索树**
>	- 各种操作，重点是插入和删除
# 1.基本知识
## 1.1.定义：它是一组节点，可以为空，如果不为空：
- 包含 1 个**根节点 (root)** r
- 有 0 个或多个**子树 (subtrees)** $T1,…,Tk​$，每个子树的根节点都和 r 通过一条**边 (edge)** 连接
>[!tip] 注：
>- 子树之间不会相互连接，因此每个节点都是某个子树的根节点
>- 对于一棵有 N 个节点的树，它有 N−1条边

## 1.2.基本术语
![[8ca644fd0951bef54e9586b63eaf22af.jpg]]

![[64b701f9be8d52bd2d15f5820180ad42.jpg]]

## 1.3.性质
![[62e6faea69617e42625b6d3a19c79d0e.jpg]]
![[7e8ac77b83df7612541df1a19e427c71.jpg]]

> [!note] 个人心得：
> - 对于概念搞明白深度、高度两个概念。深度是从根节点开始算的层数（根节点的深度为0）；高度是从叶节点开始算的（叶节点的深度为0）（那两个公式算是特例）
> - 区分好度为m的树和m叉树（度为m说明至少有一个节点的度为m；m叉树是一开始在构建树的时候设计好了度为m，但经过删除插入等操作之后它的度不一定是m，甚至可以为空树）
> - 任何一棵树都可以转化成二叉树
> - 树都可以用一个一维数组来表示（每个位置可以存储当前节点的父节点的index）

# 2.Binary Tree 二叉树
## 2.1.基本概念
**二叉树 (binary tree)**：每个节点拥有不超过两个孩子的树（最大度为2的树）
![[Pasted image 20260331153752.png]]
补充：一般树（左图）的后序遍历 = 由上述方法得到的二叉树（右图）的中序遍历

## 2.2.Tree Traversals
**树的遍历 (tree traversals)**：对树的每个节点都访问一次，时间复杂度为 $O(N)$
### 2.2.1. 前序遍历 (preorder traversal)
```c
void preorder(tree_ptr tree)
{
    if (tree)
    {
        visit(tree);//visit=printf
        for (each child C of tree)
            preorder(C);
    }
}
```

### 2.2.2. 后序遍历 (postorder traversal)
```c
void postorder(tree_ptr tree)
{
    if (tree)
    {
        for (each child C of tree)
            postorder(C);
        visit(tree);
    }
}
```

### 2.2.3.层序遍历 (levelorder traversal)
```c
void levelorder(tree_ptr tree)
{
    enqueue(tree);
    while (queue is not empty)
    {
        visit(T = dequeue());
        for (each child C of T)
            enqueue(C);
    }
}
```

### 2.2.4.中序遍历 (inorder traversal)
```c
// Recursion
void inorder(tree_ptr tree)
{
    if (tree)
    {
        inorder(tree->Left);
        visit(tree->Element);
        inorder(tree->Right);
    }
}

// Iteration(using stack)
void iter_inorder(tree_ptr tree)
{
    Stack S = CreateStack(MAX_SIZE);
    for (;;)
    {
        for (; tree; tree = tree->left)
            Push(tree, S);
        tree = Top(S);
        Pop(S);
        if (!tree)
            break;
        visit(tree->Element);
        tree = tree->Right;
    }
}
```

>[!note] 总结点：
>- 知道==前序或者后序遍历 + 中序遍历==，可以确定唯一的一棵树
>- 知道前序遍历 + 后序遍历，一般情况下无法确定树的形状

## 2.3. Threaded Tree 线索二叉树
**线索二叉树 (threaded binary trees)**很好地利用了闲置的节点，具体规则如下：
- 如果 `Tree->Left` 为空，将它指向**中序**遍历中的**前一个节点**
- 如果 `Tree->Right` 为空，将它指向**中序**遍历中的**后一个节点**
- 有一个**头节点**(dummy node)，使得_最左边_和_最右边_孩子分别指向这个节点的左右孩子

## 2.4 Special tree

### 2.4.1 skewed tree 斜二叉树
![[Pasted image 20260331182642.png]]
### 2.4.2 comlete binary tree 完全二叉树
![[Pasted image 20260331182727.png]]

## 2.5 性质
- 第 $i$层 $(i≥1)$ 最多拥有 $2i−1$ 个节点；深度为 $k$ 的二叉树最多有 $2^{k+1}−1$个节点 ($k≥1$)
- 对于非空的二叉树，$n_0=n_2+1$，其中 $n_0$是叶子节点个数，$n_2$​ 是度为 2 的节点个数
>[!note] 推论：
>- 推论1：对于一棵完全二叉树，易知 $n_1=0$ 或 $1$。由 $n_0=n_2+1$ 知 :
>	- 完全二叉树有奇数个节点时，$n_1=0$
>	- 完全二叉树有偶数个节点时，$n_1=1$
>- 推论2：$n$ 叉树的叶子节点个数与 $n_1$​ 无关，且$n_0=\sum_{i=2}^{n}(i-1)n_i+1$

## 3.Binary Search Tree
### 3.1.Definition

- A binary search tree is a binary tree.  It may be empty.  If it is not empty, it satisfies the following properties:
(1)  Every node has a key which is an integer, and the keys are distinct.
(2)  The keys in a nonempty left subtree must be smaller than the key in the root of the subtree.
(3)  The keys in a nonempty right subtree must be larger than the key in the root of the subtree.
(4)  The left and right subtrees are also binary search trees.

## 3.2.代码实现
### 3.2.1 Find
- 递归版本
![[Pasted image 20260331201107.png]]

- 迭代版本
![[Pasted image 20260331201327.png]]

- **FindMin**
![[Pasted image 20260331202359.png]]

- **FindMax**
![[Pasted image 20260331202424.png]]

### 3.2.2 插入
![[Pasted image 20260331202515.png]]

### 3.2.3.删除
![[Pasted image 20260331202539.png]]

## 4.一般情况分析
- **Question**:  Place n elements in a binary search tree.  How high can this tree be?
- **Answer**:  The height depends on ***the order of insertion***.
>[!note] **Example**
>![[Pasted image 20260331202715.png]]



