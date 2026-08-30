# Introduction
Mathematical induction is used to prove propositions of the form "nP(n), where the domain of discourse is the set of positive integers. 

# prove step
>[!note] 基本步骤
>- Basis step： Establish P(1)
>- Inductive step： Prove that $P(k) \to P(k+1)$ for $k \ge 1$
> 			Conclusion:  $\forall n P(n)$ , where the domain  is the set of positive integers 

$$ (P(1) ∧ \forall k(P(k) \to P(k+1))) \to \forall n P(n) $$
# well-ordering 良序集
- ## define：
	The validity of mathematical induction follows from the well-ordering property for the set of positive integers.
    A set S is well ordered  **if every nonempty subset of S has a least element.**
- ## application
证明数学归纳法的正确性：
>[!note]
>Assume that there is at least one positive integer for which P(n) is false.
S: the set of positive integer for which P(n) is false.
Then S is nonempty.
By the well-ordering property, S has a least element, which will be denoted by m.
Then $m>1$, m-1 is a positive integer. m-1 is not in S. So P(m -1) is true.
Since the implication $P(m-1)\to P(m )$ is also true, P(m) must be true. 
By contradiction, $\forall nP(n)$ 

# 数学归纳法证明例子
## example
![[Pasted image 20260402203216.png]]