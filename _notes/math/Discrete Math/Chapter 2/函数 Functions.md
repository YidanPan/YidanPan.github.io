Before this ,you can read [[functions的简略预习]]
# 1.Introduction

## Define

### 形式
Let A and B be _nonempty_ sets. A **函数(function)** (mapping or transformations) $f$ from **A** to **B**:

$$f:A→B$$
$$∀a(a∈A→∃!b(b∈B∧f(a)=b))$$
tips：也就是说，对于A中的每一个x，有且仅有一个b在B中，不能一个x对应两个y。

**一些基本概念**：
- A is called the **定义域(domain)** of $f$
- B is called the **值域(codomain)** of $f$

If $f(a)=b$,

- b is called the ***image*** of a under $f$.
- a is called a ***preimage*** of b.
Let $f$ be a function from the set ***A*** to the set ***B***. The **图(graph)** of the function ***f*** is the _set_ of ordered pairs:

$${(a,b)∣a∈A∧f(a)=b}$$
---
# 2. 特征

## 2.1 单射 (one-to-one function = injection) 

- define:
	A function f is **单射函数(one-to-one function = injection)** (denoted 1-1), or **单射的(injective)** if
	$$∀a∀b(f(a)=f(b)→a=b)$$
	tip：简单而言，一个y不能对应两个x，举个反例：$f(x)=x^2$,这里一个y值对应过去有两个x相符合，不能说是单射。
	且单射不一定是单调的，可以是离散的点.
	e.g.考虑两个集合：$A=\{1,2,3\}$，$B=\{1,2,3\}$,let $f(1)=3,f(2)=1,f(3)=2$,这样的对应关系使之不是单调的。

## 2.2 满射(onto)

- define:
	A function $f$ from A to B is called **满射函数(onto function = surjection)**, or **满射的(surjective)** if


$$∀ b\in B ∃ a\in A(f(a)=b)$$
	tip:满射也就是每一个y值都能在A中知道啊一个x与之对应。也就是满足：$|A|<=|B|$。

## 2.3 双射(bijection)

- define:
	The function f is a **一一对应的(one-to-one correspondence)**, or a **双射(bijection)**, if it is both _one-to-one_ and _onto_
	
>[!note]  Showing that $f$ is one-to-one or onto
>
>![Showing that ff is one-to-one or onto](https://img.memset0.cn/2024/03/19/OoeOyjuL.png)

---

# 3.反函数 Inverse Functions

Let $f$ be a bijection from A to B. Then the **反函数(inverse function)** of f, denoted as f−1, is the function from B to A defined as

$$f^{-1}(y)=x \iff f(x)=y$$

- 函数 f 的反函数存在当且仅当函数 f 是双射函数。
	Function f is **可逆的(invertible)** if and only if f is bijective. No inverse function exists unless f is a bijection.
---
# 4.函数的复合 Compositions of Functions

Let **g** be a function from the **set A to the set B** and let**f** be a function form the **set B to the set C**. The composition of the functions f and g denoted by $f∘g$ is defined by:

**$$f∘g(a)=f(g(a))$$**

- $f∘g$ can’t be defined unless the range of g is a subset of the domain of f
---
# 5.高斯函数 Floor and Ceiling Functions

>[!note] 高斯函数的实用性质（ceiling & floor）
>
>![image](https://img.memset0.cn/2024/03/19/bw4HXnEf.png)

- ceiling function:天花板函数，向上取整。
- floor function：地板函数，向下取整。
- tip：在系列1中这些等式都可以相互推导。
---
# 6.特殊的函数（数列 Sequence）

A **数列(sequence)** is a function from a subset of the set of integers (usually either the set {0,1,2,…} or the set {1,2,3,…}) to a set S. We use the notation $a_n$​ to denote the image of the integer $n$. We call an a term of the sequence.

- A **等比数列(geometric progression)** is a sequence of the form
>$$a, ar, ar^2, …, ar^n$$
>where the initial term a and the **公比(common ratio)** r are real numbers.


- An **等差数列(arithmetic progression)** is a sequence of the form

>$$a, a+d, a+2d …, a+nd$$
>where the initial term **a** and the **公差(common difference)** **d** are real numbers.

- **和式 Summations:**
	>$$\sum_{s \in S}f(s)$$

---
>[!note] 常用的求和公式：

![image](https://img.memset0.cn/2024/03/19/nO5YyxEI.png)


---

The next part is [[基数 Cardinality of Sets]]