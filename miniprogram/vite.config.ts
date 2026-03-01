import { defineConfig } from "vite";
import { resolve } from "path";
import { readdirSync, cpSync, mkdirSync, existsSync } from "fs";
import type { Plugin } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

/** 复制规则的配置 */
interface CopyTarget {
  /** 源目录（相对于项目根） */
  srcDir: string;
  /** 目标目录（相对于构建输出目录） */
  destDir: string;
  /** 文件过滤，默认复制所有文件 */
  filter?: (filename: string) => boolean;
}

/**
 * 通用复制插件：在构建完成后将指定目录中的文件复制到输出目录
 */
function copyPlugin(targets: CopyTarget[], options?: { name?: string }): Plugin {
  const pluginName = options?.name ?? "copy-plugin";
  let root: string;
  let outDir: string;

  return {
    name: pluginName,
    configResolved(config) {
      root = config.root;
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      for (const { srcDir, destDir, filter } of targets) {
        const srcPath = resolve(root ?? process.cwd(), srcDir);
        if (!existsSync(srcPath)) continue;
        const files = readdirSync(srcPath).filter(
          (f) => !filter || filter(f)
        );
        if (files.length === 0) continue;
        const destPath = resolve(outDir, destDir);
        mkdirSync(destPath, { recursive: true });
        for (const file of files) {
          cpSync(resolve(srcPath, file), resolve(destPath, file));
        }
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    copyPlugin([
      {
        srcDir: "src/image-process",
        destDir: "image-process/",
        filter: (f) => f.endsWith(".wasm.br"),
      },
    ]),
  ],
});
