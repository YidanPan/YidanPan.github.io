# 题目(HW4) -- 2026.5.28
Suppose that all the keys in a binary tree are distinct positive integers. A unique binary tree can be determined by a given pair of postorder and inorder traversal sequences. And it is a simple standard routine to print the numbers in level-order. However, if you think the problem is too simple, then you are too naive. This time you are supposed to print the numbers in "zigzagging order" -- that is, starting from the root, print the numbers level-by-level, alternating between left to right and right to left. For example, for the following tree you must output: 1 11 5 8 17 12 20 15.

![zigzag.jpg](https://images.ptausercontent.com/337cbfb0-a7b2-4500-9664-318e9ffc870e.jpg)

### Input Specification:

Each input file contains one test case. For each case, the first line gives a positive integer N (≤30), the total number of nodes in the binary tree. The second line gives the inorder sequence and the third line gives the postorder sequence. All the numbers in a line are separated by a space.

### Output Specification:

For each test case, print the zigzagging sequence of the tree in a line. All the numbers in a line must be separated by exactly one space, and there must be no extra space at the end of the line.

# 构建二叉树
- 存储中序序列&后序序列
- 函数返回值应该是根节点
- 后序序列确定根节点
- 在中序序列中遍历找到根节点对应位置，记录下对应下标，划分出左右子树的个数
- 递归构建左右子树
- 注意函数传入的值应该是这次要找的中序序列的左右值以及后序序列的左右边界值

# Z字形遍历
- 5.18第二次写的时候依然还是痛苦且依靠AI的
- 本质其实就是层序遍历
- 利用队列的结构实现层序遍历
- 开一个二维数组来存储每一层的节点值，同时需要一个一维数组存储每一层的节点数
- 队列实现的思想主要就是：每一次循环开始用尾减头确定这一层的节点数，pop出一个节点就把他对应的左右孩子enqueue，直到把这一层的节点全部pop完成，开始下一层。
- 如果是要实现一维数组的反转，利用双指针去把头尾swap，然后一个--，一个++
- 在拿到二维数组之后，遍历时只要确认层数是奇数还是偶数层，奇数层从后向前遍历，偶数层从头开始遍历，对应的变量范围不要搞错了。

# 代码
```c
#include<stdio.h>

#include<stdlib.h>

  

#define MAX 50

int inorder[MAX]={-1};

int postorder[MAX]={-1};

  

typedef struct Node{

    int key;

    struct Node* left;

    struct Node* right;

}Node;//树的每一个节点

  

Node* BuildBST(int inl,int inr,int postl,int postr){//返回的是根节点

    //找到递归出口

    if(inl>inr||postl>postr)return NULL;

    //初始化一个根节点

    Node* root=NULL;

    root=malloc(sizeof(Node));

    root->key=postorder[postr];

    root->left=NULL;

    root->right=NULL;

    //在中序序列中划分左右子树，输出每个子树的节点数量

    int i;

    int temp=root->key;

    for(i=inl;i<=inr;i++){

        if(inorder[i]==temp){

            break;

        }

    }

    int num_left=i-inl;

    //构建左右子树

    root->left=BuildBST(inl,i-1,postl,postl+num_left-1);

    root->right=BuildBST(i+1,inr,postl+num_left,postr-1);

  

    return root;

}

  

void zigzag(Node* tree){//层序遍历（队列），遇到奇数层反转，偶数层正常输出

    if(tree==NULL)return;

    int level[MAX][MAX]={0};

    int layer_size[MAX]={0};

    int layer=1;

    //初始化一个队列

    Node* queue[MAX]={NULL};

    int front=1;

    int rear=1;

    queue[rear++]=tree;

  

    //层序输出保存在二维数组中

    while(front<rear){

       int current_layer_size=rear-front;

       layer_size[layer]=current_layer_size;

       int i;

       for(i=1;i<=current_layer_size;i++){

            Node* current=queue[front++];

            level[layer][i]=current->key;

            if(current->left!=NULL){

                queue[rear++]=current->left;

            }

            if(current->right!=NULL){

                queue[rear++]=current->right;

            }

       }

       layer++;

    }

    //按要求输出

    int i=1;

    int first=1;

    for(i=1;i<=layer-1;i++){

        if(i%2==1){//奇数层反转

            int k=layer_size[i];

            for(;k>=1;k--){

                if(first==1){

                    printf("%d",level[i][k]);

                    first=0;

                }else{

                    printf(" %d",level[i][k]);

                }

            }        

        }else{

            int k;

            for(k=1;k<=layer_size[i];k++){

                if(first==1){

                    printf("%d",level[i][k]);

                    first=0;

                }else{

                    printf(" %d",level[i][k]);

                }

            }

        }

    }

    printf("\n");

}

  

int main(){

    int n;

    scanf("%d",&n);//总的节点数

    //输入中序和后序序列

    int i=1;

    for(i=1;i<=n;i++){

        scanf("%d",&inorder[i]);

    }

    for(i=1;i<=n;i++){

        scanf("%d",&postorder[i]);

    }

    //根据中序和后序序列构建二叉搜索树

    Node* Tree=BuildBST(1,n,1,n);

    //z字形遍历二叉树

    zigzag(Tree);

    return 0;

}
```