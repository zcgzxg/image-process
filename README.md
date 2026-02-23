# image-process

一个基于 Rust 和 WebAssembly 的高性能图片处理库，支持在浏览器和小程序环境中运行。

## 项目介绍

本项目使用 Rust 编写图片处理核心逻辑，通过 WebAssembly 技术编译为 wasm 模块，可在 Web 前端环境中高效执行图片处理任务。相比纯 JavaScript 实现，具有更好的性能和更小的包体积。

### 主要功能

- **图片缩略图生成**：按指定宽高生成图片缩略图，保持宽高比
- **图片叠加**：在图片上叠加水印或其他图片
- **多格式支持**：支持 PNG、JPEG、WebP 格式的图片处理

## 技术栈

- **Rust**: 核心图片处理逻辑
- **WebAssembly**: 编译目标，实现高性能 Web 应用
- **wasm-bindgen**: Rust 与 JavaScript 交互桥梁
- **image crate**: Rust 图片处理库

## 构建方式

### 前置要求

- Rust Nightly（建议使用 `rustup` 安装，并添加 `wasm32-unknown-unknown` target）
- `wasm-bindgen-cli`
- `wasm-opt`（用于压缩 WASM 体积，来自 `binaryen`）
- `static-compress`（用于压缩 wasm 文件）
- Node.js（用于运行 `web/` 下的 Vue 示例）
- `ast-grep`（小程序构建时需要）

安装依赖示例：

```bash
# 安装 Rust（如未安装）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 安装 Nightly 工具链并添加 wasm32 target
rustup toolchain install nightly
rustup target add wasm32-unknown-unknown --toolchain nightly

# 安装 wasm-bindgen-cli 与 static-compress
cargo install wasm-bindgen-cli static-compress

# 安装 ast-grep（小程序构建需要）
cargo install ast-grep

# 安装 wasm-opt（来自 binaryen，可按操作系统选择其一）
# 例如：
#   npm install -g binaryen
#   或 brew install binaryen
#   或 apt install binaryen
```

### 构建方式

#### 1. Web 环境构建（用于浏览器）

执行构建脚本：

```bash
./build.sh
```

该脚本会完成：

- 使用 `cargo +nightly build --release` 进行 Release 构建
- 使用 `wasm-bindgen` 生成 JS/WASM 绑定文件到 `web/src/image-process`
- 使用 `wasm-opt` 对 `.wasm` 文件进行深度体积优化
- 对 `.wasm` 文件做 Brotli 压缩

构建产物位于 `./web/src/image-process` 目录，包含：

- `index.js`: JavaScript 绑定代码
- `index_bg.wasm`: WebAssembly 模块
- `*.wasm.br`: Brotli 压缩的 wasm 文件

#### 2. 小程序环境构建

执行小程序构建脚本：

```bash
./build-mp.sh
```

构建产物位于 `./dist-mp` 目录，包含：

- `lib.js`: 修改后的 JavaScript 代码（已处理小程序兼容性）
- `lib_bg.wasm`: WebAssembly 模块
- `*.wasm.br`: Brotli 压缩的 wasm 文件

> 注意：小程序构建会自动注入 `TextDecoder` 和 `TextEncoder` 的 polyfill 导入语句，以兼容小程序环境。

## 使用方式

### 运行 Web 演示项目

本项目在 `./web` 目录下提供了一个完整的 Vue 3 演示应用。

#### 1. 安装依赖

```bash
cd web
pnpm install
```

#### 2. 启动开发服务器

```bash
pnpm dev
```

启动后访问 http://localhost:5173 即可看到演示页面。

#### 3. 构建生产版本

```bash
pnpm build
```

构建产物位于 `./dist` 目录。

#### 4. 预览生产构建

```bash
pnpm preview
```

### 在自己的项目中使用

#### JavaScript/TypeScript 中使用

```typescript
import init, { Image } from "./image-process";

// 初始化 wasm 模块
await init();

// 读取图片文件
const fileBuffer = await file.arrayBuffer();
const imageData = new Uint8Array(fileBuffer);

// 创建图片对象
const image = new Image(imageData);

// 获取图片 MIME 类型
console.log(image.mimeType); // 例如: "image/jpeg"

// 生成缩略图（宽度 200px，高度 200px）
const thumbnailData = image.thumbnail(200, 200);
const thumbnailBlob = new Blob([thumbnailData], { type: image.mimeType });
const thumbnailUrl = URL.createObjectURL(thumbnailBlob);

// 图片叠加（在图片右下角添加水印）
const watermarkImage = new Image(watermarkData);
const resultData = image.overlaying(watermarkImage);
const resultBlob = new Blob([resultData], { type: image.mimeType });
```

#### Vite 项目配置

如果在 Vite 项目中使用，需要安装相关插件：

```bash
pnpm add -D vite-plugin-wasm vite-plugin-top-level-await
```

在 `vite.config.ts` 中配置：

```typescript
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [wasm(), topLevelAwait()],
});
```

### API 说明

#### `Image` 类

##### 构造函数

```typescript
new Image(imageData: Uint8Array): Image
```

创建图片对象，支持 PNG、JPEG、WebP 格式。

**参数：**

- `imageData`: 图片的二进制数据

**返回：**

- `Image` 对象

**异常：**

- 不支持的格式或无效的图片数据会抛出错误

##### 属性

- `mimeType: string` - 图片的 MIME 类型（如 "image/jpeg"、"image/png"、"image/webp"）

##### 方法

###### `thumbnail(width: number, height: number): Uint8Array`

生成缩略图，保持图片宽高比。

**参数：**

- `width`: 目标宽度（像素）
- `height`: 目标高度（像素）

**返回：**

- 缩略图的二进制数据（与原图格式相同）

###### `overlaying(topImage: Image): Uint8Array`

在当前图片上叠加另一张图片。叠加的图片会自动缩放到原图的 10% 大小，并定位在右下角（距离右下角 12% 位置）。

**参数：**

- `topImage`: 要叠加的图片对象

**返回：**

- 叠加后的图片二进制数据

## 性能优化

项目在 `Cargo.toml` 中配置了多项优化选项：

- `opt-level = 3`: 最高级别的编译优化
- `lto = true`: 启用链接时优化
- `strip = true`: 移除调试符号
- `codegen-units = 1`: 单个代码生成单元以获得更好的优化
- `panic = "abort"`: panic 时直接终止，减小体积

构建后使用 Brotli (质量 11) 压缩 wasm 文件，可显著减小传输体积。

## 开发

### 项目结构

```
.
├── src/
│   ├── lib.rs          # 库入口
│   ├── thumbnail.rs    # 图片处理核心逻辑
│   └── utils.rs        # 工具函数
├── web/                # Web 演示项目
├── dist-mp/            # 小程序构建产物
├── build.sh            # Web 构建脚本
├── build-mp.sh         # 小程序构建脚本
└── Cargo.toml          # Rust 项目配置
```

### 本地开发

修改代码后重新构建：

```bash
# Web 环境
./build.sh

# 小程序环境
./build-mp.sh
```
