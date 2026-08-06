# Replacement Selecting Sorting

## 题意说明：
保存数据需要用到内存和外存（external sorting），在外部存储给出一个最大内存限制，依次从内存中选取前n个数据进行排序，排序规则是：如果下一个进来的数比出去的大，放入第一顺次；反之，留着到下一次排序。给出最后的排序结果。从小到大排序。

## 数据结构：
- heap的使用：
		先初始化一个最小堆，每次输出就输出最顶上的那个，然后新进来的那个数字跟出去的那个比较，如果是小于它，就把他放在堆的最后，反之就放在顶上然后向下调整。

## 做题感受：
- 学会用动态分配内存去建立新的数组变量了，在内存中让一个指针指向一个新的malloc的地方，后面这个指针可以直接当做数组去使用。（这个就是上学期说的数组名本质就是一个指向一个地址的指针）
- 工程上还是多数会选择用空间换时间，在写代码的操作上更方便了。
- 要学会直接在内存修改，函数也要学会直接传入地址的写法。（想想学这个总比学物理好，晦涩难懂的公式不如计算机给出的直接，至少有逻辑可以去理解。）
- 重温了一下最小堆的建立和向下调整的代码，真的不用起来就会很不熟悉啊啊
- 真的要理解每个函数在做什么，每个传入的参数到底是什么作用，不然调用函数真的就是一坨。。。
- 把一道题分开成三天去写真的很折磨 每次写每次思路要重新建立 还要重新再理解一遍题目还是很费时间 下面就需要我独立一个人再写一遍巩固一下了

## 实际代码：
```c
#include<stdio.h>

#include<stdlib.h>

void swap(int* a,int* b){

    int temp=*a;

    *a=*b;

    *b=temp;

}

void siftdown(int index,int heap[],int n){

    int lindex=index*2;

    int rindex=index*2+1;

    if(lindex>n)return;//注意每次需要先判断是否会越界

    int mindex=lindex;

    if(rindex<=n&&heap[rindex]<heap[mindex]){

        mindex=rindex;

    }

    if(heap[index]>heap[mindex]){

        swap(&heap[index],&heap[mindex]);

        siftdown(mindex,heap,n);

    }

}

void Buildheap(int n,int heap[]){

    int i=1;

    for(i=n/2;i>=1;i--){

        siftdown(i,heap,n);

    }

}

int main(){

    int n,m;

    scanf("%d %d",&n,&m);//n-总数量 m-内存总空间

    int* input=malloc((n+1)*sizeof(int));

    int* heap=malloc((m+1)*sizeof(int));

    int i=0;

    for(i=1;i<=n;i++){

        scanf("%d",&input[i]);

    }

    int heap_index=1;

    for(i=1;i<=m&&i<=n;i++){

        heap[i]=input[heap_index++];

    }
    //初始化建堆

    int heap_size=(n>m)?m:n;

    Buildheap(heap_size,heap);

    int total=heap_size;//total=活跃的加保存在下一轮的

    int current=heap[1];

    int first=1;

    //开始一边输出一边判断读入

    while(total>0){//内存数据还没完全输入完或者活跃排序部分的外存还有多

        if(heap_size==0){

            printf("\n");

            heap_size=total;//全程可以保证total小于等于m

            first=1;

            Buildheap(heap_size,heap);

        }//开始下一轮

        current=heap[1];

        //开始输出fisrt one

        if(first==1){

            printf("%d",current);

            first=0;

        }else{

            printf(" %d",current);

        }
         //读入下一个 分成两种情况 一个是input里还有数据可以读入 还有一个是input里没有数据可以读入但是heap的活跃数组还有数据可以输出

        int last_out=current;

        if(heap_index<=n){

            int next_in=input[heap_index++];

            if(next_in>=last_out){

                heap[1]=next_in;

                siftdown(1,heap,heap_size);

            }else{

                heap[1]=heap[heap_size];

                heap[heap_size]=next_in;

                heap_size--;

                siftdown(1,heap,heap_size);

            }

        }else{

            heap[1]=heap[heap_size];

            for(i=heap_size+1;i<=total;i++){

                heap[i-1]=heap[i];

            }

            heap_size--;

            total--;

            siftdown(1,heap,heap_size);

        }

    }

    printf("\n");

    free(input);

    free(heap);

    return 0;

}
```