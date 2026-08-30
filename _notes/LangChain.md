# Overview
- LangChain 是一个用于构建 **基于大语言模型（LLM）的应用开发框架**。它的目标是帮助开发者更方便地将 LLM 与外部数据、工具、数据库和业务流程结合起来
- LLM + 数据 + 工具 + 工作流 = LangChain 的主要应用场景
- 主要模块:统一管理各种大模型、Prompt参数化、输出解析、读取各种文档、文本切分、向量化、向量数据库、检索器（RAG）、调用Tools、Agent
- 优点：模块化程度高、支持大量模型、集成方便、Python 和 JavaScript/TypeScript 都有成熟支持。
- 局限性：对于简单调用API官方的SDK更为轻量级

## Document
- rag还需要来源、页码、文件名、作者等内容，document就是文本内容和附加信息组装在一起统一表示
- 最重要的两个属性：document.page_content  document.metadata（元数据就是跟文本内容对应起来的内容）
## Text Splitter
- TextLoader：读取文档中的内容
- RecursiveCharacterTextSplitter ：一个按照字符，并且尽量保持文本结构进行切分的 Text Splitter。更适合自然语言结构的切分。最终是创建一个切分的工具对象
- splitter.split_documents（）：对文本进行切分。得到的是一个`list[document]` list中每个元素都是document对象
## Embedding
- Langchain中把向量化封装成一个模块进行使用
- embeddings = HuggingFaceEmbeddings(

    model_name="sentence-transformers/all-MiniLM-L6-v2"

) ：这里HuggingFaceEmbeddings是用来创建Embedding模型，里面封装了很多功能
- embeddings.embed_documents(...) ：把多个文本文档转换为向量
## FAISS
- FAISS.from_documents(
    chunks,
    embeddings
)： embeddings是Embedding模型。相当于告诉 LangChain，把这些 Document 转换成向量，然后建立一个 FAISS 向量索引。
- Langchain把FAISS功能封装成统一接口。把chunk和向量储存进FAISS
## Retrieval
- retriever = vectorstore.as_retriever(
    search_kwargs={"k": 2}
)： 检索功能实现。选出向量距离最接近的前两个
- results = retriever.invoke(
    "What is Python used for?"
)：插入检索对象，也就是问题内容
## Prompt
- PromptTemplate：该函数用于常见提示语模版，{context}是变量占位符。也是创建模版工具
- prompt.invoke：真正填入需要的内容
## 接入LLM
- from langchain_ollama import ChatOllama 直接引入封装好的ollama
- ChatOllama(model="qwen2.5:3b")：确定模型名称
# LCEL（LangChain Expression Language）
- 解决问题：怎么把这些组件组合起来，让数据自动从一个组件流到下一个组件
- 核心思想之一：每个组件都有输入和输出
- chain=prompt | llm，这里的|相当于pipeline，把前一个组件的数据传递给下一个组件
- 之前是靠自己手动完成prompt传递给llm，Langchain把这些步骤封装起来
- 把retrieve接入lcel：RunnablePassthrough() 作用是输入是什么，就原样传下去
- FAISS持久化：把document切分后转为embedding存入FAISS之后保存入硬盘
- 读取多文档：
	```
	DirectoryLoader(
	    "data",
	    glob="*.txt",
	    loader_cls=TextLoader,
	    loader_kwargs={
	        "encoding": "utf-8"
	    }
	)
	```
- RunnableParallel:实现同一个输入应用不同的分支
- RunnableLambda：传入参数是一个python函数，返回结果是langchain中传递数据给函数的返回结果
- MMR = Maximum Marginal Relevance：既要相关，又要不重复。也就是需要考虑和query的相关性以及和已经选择的chunk的差异性
- 处理pdf文件：from langchain_community.document_loaders import PyPDFLoader，从社区导入加载pdf文件的工具，通常一个pdf页面对应一个document（content、source、page）
- 向量用来判断语义相似，matedata负责结构化筛选