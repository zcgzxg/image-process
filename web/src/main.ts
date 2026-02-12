import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

const t0 = Date.now();

// WASM 模块在 image-process 入口中自动初始化（wasm-bindgen bundler target）
// vite-plugin-wasm 会处理 .wasm 的导入和实例化

createApp(App).mount("#app");

console.log(`应用挂载完成，耗时: ${Date.now() - t0}ms`);
