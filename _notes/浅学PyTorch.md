# 1.环境配置
- 传统方法：python代码文件--python解释器（检查翻译）--计算机（二进制）
- ![[Pasted image 20260903104258.png|547]]
- ![[Pasted image 20260903105101.png|517]]
- 我的理解：anaconda就是提供创建环境的软件，你可以在他的命令行中创建自定义虚拟环境，每个环境中安装不同版本的python解释器、一些工具包。jupyter是一个屏幕上实时显示交互的python解释器，在jupyter中可以给不同环境的python起别名，这样在jupyter中可以选择当前文件在哪个环境下执行。pycharm就是一个集成ide，拥有一些配置，可以编译python文件。
- jupyter中用enter+shift可以跳转到下一个代码块同时运行上一个代码块
- 环境中安装了很多package，每个包就是一个工具箱，pytorcch就是其中之一
# 2.加载数据
## 2.1.两个重要的类
- Dataset：知道如何获取数据以及总共有多少数据
- Dataloader：打包数据提供不同的数据形式
## 2.2.实际代码编写
- from torch.utils.data import Dataset :引入dataset这个类
- 在自定义data类中需要重写init（全局变量）
- 用到cv2库：pip install opencv-python   ---> import cv2
- ![[Pasted image 20260904101819.png]]

# 3.TensorBoard
- 机器学习是AI领域的一个分支，意思是把数据给机器，让机器在数据中发现规律
- 深度学习同样是让机器进行学习，多了一个多层神经网络的过程。
- 训练过程：数据--模型--预测--Loss--Backward--Optimizer.step()--Tensorboard记录--分析结果
## 3.1. tnsorboard使用
- tensorboard：一个可以把训练过程画成图的软件
- SummaryWriter():一个深度学习需要的库。实例化的时候会创建一个训练日志记录文件夹。
- add_scalar()：添加标量数据到summary中。需要的参数是tag，Y轴，X轴
- add_image():对图片进行处理
## 3.2.常见Transforms使用
`from torchvision import transforms`
- transforms.ToTensor()(img):传入img格式是PIL或者NP，把图片转换为tensor（CHW）
- transforms.Normalize(mean,std):mean和std的维数都应该和图片参数的维数是一致的。计算公式是：（input-mean)/std，mean是均值，std是标准差，归一化能够改变数据分布，变的更均匀稳定
- transforms.resize():改变图片的大小参数
- transforms.Compose(）：把一系列方法组合起来使用，且按顺序执行。注意compose的参数是需要一个list，且list中每个参数都是一个transforms的具体工具。list工具中前一个的输出是后一个工具的输入
- transforms.RandomCrop(size):随机裁剪工具。每次从原图里随机选一个位置，裁出固定大小的一块图片。跟risize一样，输入的size要么是一个序列（h，w），要么是一个整数（size，size）。调用工具输入的image是PIL image
## 3.3.总结使用方法
- 先查找原方法的官方文档，第一句一般都是功能的全局性描述
- 关注输入输出类型（输出没有写可以用type（）或者直接print（）输出查看）
- 关注方法需要什么参数
- 最终用tensorboard看不同step下的内容
# 4.torchvision中的数据库使用
- torchvision是关于视觉方面的。
- 常用模块有：torchvisionn.datasets/torchvision.models(神经网络模型)/torchvision.transforms(详见3)/torchvision.utils
- COCO数据集：目标检测、语义分割。
- MINIST：入门数据集，用于识别手写文字
- CIFAR10：识别物体的数据集
# 5.卷积
pytorch中关于nn的常用内容
![[Pasted image 20260907174912.png]]
conv2d是处理平面图形的库。
- torch.nn.functional.conv2d(_input_, _weight_, _bias=None_, _stride=1_, _padding=0_, _dilation=1_, _groups=1_)
- torch负责神经网络的计算，torch.nn负责神经网络骨架的搭建
- 在这里输入的参数基本都需要先转化为tensor的数据类型。
- Tensor：是PyTorch中专门用来保存和计算这些数字的数据结构，可以简略理解为是很多不同维度的数学数组。
## 5.1.Conv2d的参数讲解
- in_channel:输入通道数。所谓通道数指的是图片中每个像素需要多少个层数值来描述。一般彩色的RGB是三个通道，分别代表R、G、B。
- out_channel:输出通道数。可以简单理解为这一层卷积最终想提取多少中不同的特征。对应的会决定卷积核的数量。
- kernel_size:卷积核的大小。
- stride:卷积核每次移动的间隔大小。一般取1。
- padding:在原图像周围补上的圈数。
- dilation:卷积核的数字之间的间隔。一般dilation越大，卷积核越大，感受野（特征图的某一个像素是根据多大的信息范围计算出来的）就会越大。
- groups:把in_channel分组，如果恰好等于输入通道数就是深度卷积。
注意conv2d要求输入的是四维tensor：【N,C,H,W】。而神经网络底层在做的事情就是对大量数字做矩阵运算。
## 5.2.为什么都要把图片转化为tensor
- tensor可以表示多维数组，可以做各种矩阵运算
- tensor可以放在GPU上做运算
- tensor可以自动求梯度，涉及很多额外的信息
**一张图片的一生**：
保存在硬盘中的.jpg格式的图片->PIL Image->torchvision.transforms.Totensor()->nn.conv2d()

# 6.非线性激活
- 作用：加入激活函数之后，模型可以不断弯曲自己的函数，从而拟合复杂规律
最常用：ReLU、Sigmoid
## 6.1.ReLU
参数：
- input
- inplace：替换（bool）如果是True，会直接对input进行替换。如果为False，会返回一个替换值，但不会改变input的值。
作用：把卷积层提取出来的特征做非线性处理，保留有用的正响应，抑制负响应
# 7.线性层 Linear Layers
作用：把提取到的特征重新加权组合得到新的特征图
nn.Linear:
- in_features
- out_features
- bias:default=True
# 8.Containers
解释成骨架更好理解
作用：把卷积层、激活层、池化层、线性层这些零散的模块组织起来，规定数据到底按照什么顺序流动
常用骨架：
- nn.Module：最基本的框架。是自己搭建整个神经网络的类。更加通用和自由
- nn.Sequential：本身也是nn.Module的子类，用法一致

