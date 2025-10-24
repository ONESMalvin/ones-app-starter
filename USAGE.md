# ONES App Template Usage Guide

## 本地使用 npx create-ones-app

### 1. 设置本地链接

在模板项目目录中运行：
```bash
npm link
```

### 2. 在任意目录创建新项目

```bash
# 在任意目录下运行
npx create-ones-app my-new-project
```

### 3. 项目创建流程

命令会自动执行以下步骤：
1. ✅ 创建项目目录
2. ✅ 复制模板文件
3. ✅ 更新 package.json（设置项目名称和私有属性）
4. ✅ 初始化 Git 仓库
5. ✅ 安装后端依赖
6. ✅ 安装前端依赖

### 4. 配置项目

进入项目目录并运行配置脚本：
```bash
cd my-new-project
npm run setup
```

配置脚本会询问：
- App ID（自动生成随机ID）
- App Name
- App Description  
- App Version

配置完成后，会生成 `.env` 文件，包含：
- `ONES_SERVER_URL`: ONES服务器地址
- `RELAY_TOKEN`: 开发代理令牌
- `APP_ID`: 应用ID
- `APP_NAME`: 应用名称
- `APP_DESCRIPTION`: 应用描述
- `APP_VERSION`: 应用版本
- `PORT`: 服务器端口（默认3000）

### 5. 启动开发服务器

```bash
npm run start:dev
```

## 特性

### 简化的创建流程
- ❌ 移除了不必要的交互式选择
- ✅ 默认使用 npm 包管理器
- ✅ 自动安装依赖
- ✅ 自动初始化 Git 仓库

### 模板文件处理
- ✅ 使用 `manifest.template.json` 生成 `manifest.json`
- ✅ 自动替换模板变量
- ✅ 生成个性化的配置文件

### 项目结构
```
my-new-project/
├── src/                    # NestJS 后端源码
├── web/                    # React 前端源码
├── scripts/               # 配置脚本
│   └── start-agent.js     # 代理启动脚本（自动加载环境变量）
├── manifest.template.json # 模板文件
├── env.example           # 环境变量示例
├── .env                  # 环境变量配置（运行setup后生成）
└── package.json          # 项目配置
```

### 环境变量使用

开发代理会自动从 `.env` 文件加载环境变量：

```bash
# 启动开发代理（自动加载 .env 文件）
npm run dev:agent

# 或者手动设置环境变量
ONES_SERVER_URL=https://your-server.com APP_ID=app_123 npm run dev:agent
```

## 使用示例

```bash
# 1. 在任意目录创建项目
npx create-ones-app my-ones-app

# 2. 进入项目目录
cd my-ones-app

# 3. 配置项目（生成 manifest.json 和 .env）
npm run setup

# 4. 启动开发服务器
npm run start:dev
```

## 注意事项

- 确保已运行 `npm link` 设置本地链接
- 项目名称不能与现有目录重复
- 首次运行 setup 时会生成必要的配置文件
- 开发服务器需要配置正确的 ONES 服务器信息

## 故障排除

### 命令不存在
```bash
# 重新设置链接
cd /path/to/ones-app-starter
npm link
```

### 依赖安装失败
```bash
# 手动安装依赖
cd my-new-project
npm install
cd web && npm install
```

### 配置问题
```bash
# 重新运行配置
npm run setup
```
