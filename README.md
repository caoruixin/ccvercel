# AI你画我猜游戏

一个基于Next.js开发的在线绘画猜测游戏，玩家可以在画布上绘画，AI会尝试猜测画的内容。

## 功能特点

- 🎨 HTML5 Canvas绘画功能
- 🤖 使用阿里云百炼平台的qwen-vl-plus模型进行图像识别
- 📱 响应式设计，支持移动端
- 🎯 实时AI猜测反馈
- 📊 游戏历史记录

## 技术栈

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- 阿里云百炼平台API

## 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd ai-draw-guess
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
复制 `.env.example` 为 `.env.local` 并填入你的API密钥：
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，将 `YOUR_API_KEY` 替换为你的阿里云百炼平台API密钥：
```
DASHSCOPE_API_KEY=你的实际API密钥
```

4. 启动开发服务器
```bash
npm run dev
```

5. 访问应用
打开浏览器访问 http://localhost:3000

## 如何获取API密钥

1. 访问[阿里云百炼平台](https://dashscope.aliyun.com/)
2. 注册并登录账号
3. 在控制台创建API密钥
4. 将密钥复制到 `.env.local` 文件中

## 部署

### Vercel部署（推荐）

1. 将项目推送到GitHub
2. 在Vercel导入项目
3. 设置环境变量 `DASHSCOPE_API_KEY`
4. 部署

### 其他平台部署

```bash
npm run build
npm start
```

## 项目结构

```
ai-draw-guess/
├── app/
│   ├── api/
│   │   └── analyze-drawing/    # API路由
│   ├── globals.css              # 全局样式
│   ├── layout.tsx               # 布局组件
│   └── page.tsx                 # 主页面
├── components/
│   └── DrawingCanvas.tsx        # 画布组件
├── public/                      # 静态资源
├── .env.local                   # 环境变量
└── package.json                 # 项目配置
```

## 注意事项

- 确保API密钥安全，不要提交到版本控制系统
- 画布大小为500x500像素，会自动适配移动端
- AI识别需要网络连接

## License

MIT