import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  base: "./", // 适配阿里云Pages相对路径部署
  build: {
    outDir: "dist",
    assetsDir: "assets",
    minify: "terser", // 压缩代码，减小体积
    terserOptions: {
      compress: {
        drop_console: true, // 移除控制台日志
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // 拆分代码，减小单文件体积
        manualChunks: {
          vue: ["vue"],
          echarts: ["echarts"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
