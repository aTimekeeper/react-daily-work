# 待办事项提醒工具

这是一个用 React + Vite 开发的网页版待办事项提醒工具。它可以添加待办、设置提醒时间、标记完成、删除任务，并把数据保存在当前浏览器里。

在线仓库地址：

https://github.com/aTimekeeper/react-daily-work

## 功能

- 添加待办事项
- 给待办添加备注
- 设置提醒时间
- 设置高、中、低优先级
- 标记任务完成或未完成
- 删除任务
- 按全部、待完成、今天、已逾期、已完成筛选
- 自动保存到浏览器本地存储
- 支持浏览器桌面通知提醒

## 需要先安装什么

如果你只是使用别人已经部署好的网页，不需要安装任何东西。

如果你想在自己的电脑上运行这个项目，需要先安装：

1. Node.js
2. Git

Node.js 下载地址：

https://nodejs.org/

Git 下载地址：

https://git-scm.com/

安装完成后，可以在终端里检查：

```bash
node -v
npm -v
git --version
```

能看到版本号就说明安装好了。

## 下载项目

打开终端，进入你想保存项目的目录，然后执行：

```bash
git clone https://github.com/aTimekeeper/react-daily-work.git
cd react-daily-work
```

如果你已经有项目文件，可以直接进入项目目录：

```bash
cd C:\Users\1\Desktop\new
```

## 安装依赖

第一次运行项目之前，需要安装依赖：

```bash
npm install
```

安装完成后，项目目录里会出现 `node_modules` 文件夹。这个文件夹不用上传到 GitHub。

## 本地打开项目

在项目目录执行：

```bash
npm run dev
```

终端会显示一个本地地址，通常是：

```text
http://localhost:5173/
```

把这个地址复制到浏览器里打开即可。

注意：不要直接双击 `index.html` 打开。React/Vite 项目需要通过本地开发服务器运行。

## 使用方法

1. 在“事项”输入框里写待办内容。
2. 可以在“备注”里补充说明。
3. 可以选择“提醒时间”。
4. 可以选择优先级：高、中、低。
5. 点击“添加任务”。
6. 点击任务左侧按钮可以标记完成。
7. 点击任务右侧删除按钮可以删除任务。
8. 顶部筛选按钮可以切换任务列表。

如果想收到桌面提醒，请点击页面右上角的“开启桌面提醒”，并在浏览器弹窗里允许通知。

## 数据保存在哪里

任务数据保存在当前浏览器的本地存储里。

这意味着：

- 刷新页面后任务还在
- 关闭浏览器再打开后任务通常还在
- 换一台电脑或换一个浏览器不会自动同步
- 清理浏览器缓存或网站数据后，任务可能会被删除

## 生产构建

如果你想检查项目能不能正式打包，执行：

```bash
npm run build
```

打包成功后会生成 `dist` 文件夹。

`dist` 是构建产物，不需要提交到 GitHub。

## 预览生产版本

打包后可以执行：

```bash
npm run preview
```

因为项目配置了 GitHub Pages 子路径，生产预览地址通常是：

```text
http://localhost:4173/react-daily-work/
```

## 代码检查

执行下面命令可以检查代码风格和常见问题：

```bash
npm run lint
```

## 部署到 GitHub Pages

项目已经包含 GitHub Actions 自动部署配置：

```text
.github/workflows/deploy.yml
```

当代码推送到 `main` 分支后，GitHub 会自动执行构建和部署。

部署地址通常是：

```text
https://atimekeeper.github.io/react-daily-work/
```

如果第一次部署后打不开，请检查 GitHub 仓库设置：

1. 打开 GitHub 仓库。
2. 进入 `Settings`。
3. 点击 `Pages`。
4. 在 `Build and deployment` 里选择 `GitHub Actions`。
5. 回到 `Actions` 页面，等待部署任务成功。

## 常见问题

### 直接打开 index.html 为什么不行？

这个项目是 Vite 项目，需要开发服务器处理模块和资源路径。请使用：

```bash
npm run dev
```

然后打开终端显示的地址。

### npm install 很慢怎么办？

可以换网络，或者稍后重试。国内网络有时访问 npm registry 会比较慢。

### GitHub Pages 打开后白屏怎么办？

本项目已经在 `vite.config.js` 里配置了：

```js
base: '/react-daily-work/'
```

如果你把仓库名改成了别的名字，需要同步修改这里的路径。例如仓库叫 `my-todo`，就改成：

```js
base: '/my-todo/'
```

然后重新提交并推送。

### 桌面通知没有弹出来怎么办？

请检查：

- 是否点击过“开启桌面提醒”
- 浏览器是否允许该网站发送通知
- 系统通知是否被关闭
- 任务是否设置了提醒时间
- 页面是否至少打开过一次

### 换浏览器后任务不见了怎么办？

任务保存在当前浏览器本地，不会自动同步到云端。换浏览器或换电脑后，需要重新添加任务。

## 项目结构

```text
react-daily-work
├─ public/                 静态资源
├─ src/                    React 源码
│  ├─ App.jsx              页面逻辑
│  ├─ App.css              页面样式
│  ├─ index.css            全局样式
│  └─ main.jsx             React 入口
├─ .github/workflows/      GitHub Pages 自动部署配置
├─ index.html              HTML 入口
├─ package.json            项目命令和依赖
├─ vite.config.js          Vite 配置
└─ README.md               使用说明
```

## 常用命令汇总

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```
