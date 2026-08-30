# RAG：
名称意思是检索增强生成
实现内部的参数化知识和外部的非参数化知识结合。它的运作逻辑是在大模型生成文本之前先通过检索机制在外部知识库中动态获取相关信息，并将这些参考资料融合入生成过程。

技术上：提示词工程->rag->微调
微调是指调整模型严格遵守某种独特的输出格式或者其他特定的格式，或者是将极其复杂的指令蒸馏进入模型中

主要实现过程是：
- 检索阶段：在外部知识库中动态获取信息。其中嵌入模型充当了连接器的作用，会把文本内容转换为数学向量，存入向量数据库。其中语义召回意思是当用户检索查询的时候，检索模块利用同样的嵌入模型将问题向量化，并通过相似度搜索，从数据库中找出相似的内容。
- 生成阶段：会融合两种知识。一个是上下文整合，一个是指令引导生成

rag有效预防了模型胡说八道，因为引入了外部知识库的检索功能，针对性引入特定专业领域的知识，处理特定专业的问题时候还可以缩小模型参数内容，减少计算成本。

- 基础工具：
	- 开发模型：langchain  LlamaIndex 等成熟框架
	- 记忆载体（向量数据库）：既有 **Milvus**、**Pinecone** 等适合大规模数据的方案，也有 **FAISS**、**Chroma** 等轻量级或本地化的选择  后期为了量化效果，还可以引入 **RAGAS** 或 **TruLens** 等自动化**评估工具**。
- 构建步骤：
	- **数据准备和清洗**：需要将各种不同的文件格式标准化，采用不同的分块策略（如**按语义切割**）
	- **索引构建**：将切分好的文本通过**嵌入模型**转化为数学向量存入向量数据库，可以在此阶段关联**元数据**（如页码、来源）
	- **检索策略优化**：不依赖单一的向量搜索，可以采用**混合检索**，通过向量加关键词的方式来提升召回率，并引入**重排序模型**对检索结果进行二次精选
	- **生成与提示工程**：设计一套**prompt模版**，将检索到的内容按照模版格式输出
# 学习Embedding
- 理解embedding是什么：作用是能够把文本转换成可以进行比较的数学向量
- 文件embed.py是学习成果文件：实现目标为从sentence->vector（向量）,比较两个句子语义相似度
- embedding dimension是什么：
	嵌入维度，具体说是一段文本经过Embedding 模型之后，被表示成的向量有多少个数字。同时，不同模型的 dimension 不一样。
- cosine similarity：
	解释了两个文本通过Embedding模型之后，如何判断语义相似度
	实际上是计算两个向量之间的夹角余弦值。两个向量越接近，夹角越小，越接近一，角度范围在0-180之间
- `model.encode()`：
	`model.encode()` 就是让 Embedding 模型把文本转换成向量。encode翻译过来就是编码。
	model就是调用模型，encode就是编码，实际上就是实现了把输入的文本转换为数学向量表示。但encode作用是把文本通过神经网络映射为向量的
- 同一个上下文中要使用同一个大模型：
	不同模型中的向量空间是不同的,无法比较

# 计算向量相似度
- `numpy`：Python 中专门进行数值计算的库
- np.dot()是计算两个向量点积的值
- np.linalg.norm是计算一个向量的模
> embedding shape： (3, 384)
> Python ↔ Software: 0.86191505
> Python ↔ Apple: 0.08179839
# 学习Chunking
- 中文是文本切分。作用是把一整个文档切分成一个一个的chunk，然后单独对每个chunk进行embedding
- chunk overlap：chunk可以有重叠。防止重要信息被切分在chunk边缘。但是也会导致切断单词或者段落，进一步需要根据自然语言的结构切分
- 自然语言的结构：文档、段落、句子、单词、字母
- 自然语言结构的划分方法（手搓版）：先按照段落划分，如果还是大于chunk—size，再按照句号进行句子划分。

# 学习FAISS
- 为何要引入FAISS：因为原来切分转换好的向量存储在embedding这个python变量中,但不能每次用户需要查询的时候都调用vector进行顺序遍历来计算相似度
- Facebook AI Similarity Search  词义解释：一个专门用来存储和搜索向量的索引。这是一个高效进行向量相似度搜索的库。通过问题在数据库中找最相似的向量
- 针对向量相似度搜索进行了专门的高性能优化。比起手动进行for循环效率会高很多
- IndexFaltL2:索引直接存储，通过欧氏距离进行向量搜索
- 其他的搜索方式：IndexFlatIP、HNSW、IVF、PQ
- 这个过程也就是retrieval中的一环。把用户问题通过Embedding转换成向量，通过FAISS存储最相关的向量索引返回。

# 接入 LLM
- 计划先采用免费方案：install ollama和qwen来使用
- ollama：Ollama 是一个**让你在自己电脑上本地运行大语言模型（LLM）的工具**。它帮你下载、管理和运行 Llama、Qwen、DeepSeek、Gemma 等模型，不需要自己折腾复杂的推理环境。运行地点在本地电脑，是本地模拟运行llm的工具，可以自己选择模型，适合本地体验AI

# 引入Langchain
- 创建虚拟环境：python -m venv .venv 单独在项目目录下创建一个.venv/目录，这里单独安装该项目需要的python包。(.venv) PS C:\Users\admin\Desktop\mini_RAG>出现这个样式说明已经进入了创建好的虚拟环境，接下来进行python的命令会优先在这个环境中执行。
- 激活虚拟环境：`.\.venv\Scripts\Activate.ps1`

# Conversation RAG
流程为：
```
聊天历史
   +
当前问题
   ↓
理解上下文
   ↓
把问题改写成完整问题

"What are the main stages of RAG?"
   ↓
Retriever
   ↓
RAG
```
解决当前问题依赖之前对话时，依然能够正确检索知识库

- 简单的实现版本：接收用户输入的问题，先用llm根据之前的对话把问题重新写完整，在把用户问题+对话历史+重新写的问题交给retrieve去检索，最终把检索的内容+原问题+chat历史给llm输出

# Streaming
- 概念：区别于之前的llm组织完语言完整直接输出，streaming流式输出讲究的是先打印一点，再产生，再打印。。。
- 作用是用户体感上延迟更低，更早看到内容。LangChain 官方也把 streaming 的主要意义描述为实时反馈和改善长回答的交互体验。
- 区分invoke和stream：
	response = llm.invoke(prompt)
	invoke中是把内容直接给llm，然后直接printresponse.content
	
	llm.stream(prompt)
	stream返回的是一个迭代器，会不断产出 `AIMessageChunk`。
- 同步stream和异步stream（多人请求时候才会使用：astream(））
- Token streaming/Progress streaming:一个是流式显示模型内容，一个是流式显示系统执行过程
# Agentic RAG
- 普通rag：用户一提问就直接走rag流程
- **agentic rag**：用户提问后，有agent（判断需要调用什么能力和工具）判断是否需要调用rag。RAG 从“固定流程”变成 Agent 可以调用的一个 Tool。
- 理解**agent**：一个会根据用户问题，自己决定下一步调用什么工具的 LLM。核心是控制流也是动态的，区别chain是固定的数据流向
- **tool**：本质上是给agent调用的函数。不返回完整答案，只是调用完知识库之后把资料拿出来。实现时用@tool，会把函数包装成agent可以调用的工具
- 当前 LangChain 的核心 Agent API 是 `create_agent()`。官方对 Agent 的定义就是：**模型在一个循环中调用工具，直到任务完成**；`create_agent` 可以直接接收模型、tools 和 system prompt。工具可以是普通 callable 或 LangChain Tool。
- 官方目前推荐的基本写法是使用 `@tool` 装饰器；工具的函数名、参数 schema 和 docstring 都会参与模型判断如何调用它。
- system prompt其实也就是harness的行为规则。官方当前也把 Agent 理解为 “model + harness”，其中 system prompt、tools、middleware 等共同决定模型获得什么上下文以及怎么执行任务。
- agent最重要的**数据结构是message**，LangChain 当前 Agent 的基础 state 中就包含：`messages: list[BaseMessage]`,也就是当前 thread 的完整消息历史。
- agent loop
- **`create_agent()`** 自己就有 thread state。官方当前文档说明：如果要通过 `thread_id` 持久并恢复 Agent 的 conversation history，需要给 Agent 配置 **checkpointer**；本地可以直接使用 `InMemorySaver()`。
- thread_id 是对话编号，不同id之间互不影响
- Query Rewrite 没消失，只是从一个固定 Chain，变成 Agent 的推理步骤。
- LangChain 当前支持 Agent streaming，并区分例如 `updates`、`messages`、`custom` 等模式；其中 `updates` 更适合看 Agent 执行进度，`messages` 更适合 token streaming。
- **`InMemorySaver`** 是 LangGraph 提供的一个内存型 checkpointer。它负责保存 Agent 的状态，比如当前对话里的 `messages`。相当于agent的短期会话记忆
- **Multi-tool Agent**：一个任务中连续调用多个工具。实现关键是下一个 Tool 的调用参数，经常来自前一个 Tool 的结果。agent调用完一个工具，结果返回给agent，由agent整合信息继续判断是否需要进一步调用工具 
- **Agent Streaming**：把 Agent 的决策、Tool 调用、Tool 返回和最终答案实时展示出来。区别普通streaming，只是llm把token一个个输出。agent streaming需要显示的是progress streaming
- **updates**：可以看到agent执行到哪一步了。一般写成：stream_mode="updates"
- Custom Streaming：LangChain 支持 Tool 自己发送 `custom` stream event，通过 `get_stream_writer()` 输出自定义进度，获取一个向streaming通道发送信息的对象。Custom Streaming 就是让 Tool 自己在执行过程中发消息。
- 进一步更新agent：当程序查找失败时候不直接退出，反而把失败信息返回给agent，再重新调用tool进行再次执行。当agent尝试失败后也agentic retry。当某条路径失败后换用另一条路径。
- Structured Tool Error：Tool 出错时，不返回一句随意文本，而是返回一个统一结构
- LangChain 官方现在也推荐把 Web Search 作为 Tool 交给 Agent，由模型根据问题决定什么时候调用。Tools 本身就是“Agent 可以调用的外部能力”，模型会依据上下文和 tool description 决定是否调用。
- web search 通常返回的是title、url、snippets
- TavilyExtract：专门从 URL 提取清洗后的网页内容
- `get()` 的好处是：即使返回结果没有 `answer` 字段，也不会触发 `KeyError`
# CLI COMMAND
- 终端命令实现逻辑：用户输入一串字符串，先判断是不是特殊命令，如果是就执行相应命令。不是就当做普通字符串交给agent处理。
- CLI command 本质上就是在 **LLM 之前加了一层命令解析器**
- query.partition(" ") 按照空格拆开
- 不需要的参数可以直接用下划线替代
- json.load(response)能把json格式转换为python数据结构
- from urllib.request import urlopen：发送HTTP请求的工具
- `DATA_PATH.rglob("*")` :递归查找data目录下的所有文件
- `sys` 是 Python 的**标准库模块**，主要负责让 Python 程序和“Python 解释器 / 运行环境”打交道。
	- `sys.argv`：获取命令行参数
	- `sys.path`：查看/修改 Python 查找模块的路径
	- `sys.exit()`：退出程序
	- `sys.stdin / sys.stdout / sys.stderr`：处理输入、正常输出、错误输出
	- `sys.version`：查看 Python 版本
- Streamlit 是一个用 Python 构建 Web 应用界面的框架。