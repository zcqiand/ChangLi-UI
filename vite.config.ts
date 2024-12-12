import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import { wrapperEnv } from "./src/utils/getEnv"
import { visualizer } from "rollup-plugin-visualizer"
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"
import viteCompression from "vite-plugin-compression"
import vueSetupExtend from "vite-plugin-vue-setup-extend-plus"
import eslintPlugin from "vite-plugin-eslint"
import vueJsx from "@vitejs/plugin-vue-jsx"

// @see: https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
	const env = loadEnv(mode, process.cwd())
	const viteEnv = wrapperEnv(env)

	return {
		base: "./",
		resolve: {
			alias: {
				"@": resolve(__dirname, "./src"),
				"vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@import "@/styles/var.scss";`
				}
			}
		},
		server: {
			/** 是否开启 HTTPS */
			https: false,
			// 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0"
			host: "0.0.0.0",
			port: viteEnv.VITE_PORT,
			open: viteEnv.VITE_OPEN,
			cors: true,
			// 跨域代理配置
			proxy: {
				"/api": {
					target: "https://mock.mengxuegu.com/mock/629d727e6163854a32e8307e", // easymock
					// target: "https://www.fastmock.site/mock/f81e8333c1a9276214bcdbc170d9e0a0", // fastmock
					changeOrigin: true,
					rewrite: path => path.replace(/^\/api/, "")
				}
			}
		},
		plugins: [
			vue(),
			// * 使用 svg 图标
			createSvgIconsPlugin({
				iconDirs: [resolve(process.cwd(), "src/assets/icons")],
				symbolId: "icon-[dir]-[name]"
			}),
			// * EsLint 报错信息显示在浏览器界面上
			eslintPlugin(),
			// * vite 可以使用 jsx/tsx 语法
			vueJsx(),
			// * name 可以写在 script 标签上
			vueSetupExtend(),
			// * 是否生成包预览(分析依赖包大小,方便做优化处理)
			viteEnv.VITE_REPORT && visualizer(),
			// * gzip compress
			viteEnv.VITE_BUILD_GZIP &&
				viteCompression({
					verbose: true,
					disable: false,
					threshold: 10240,
					algorithm: "gzip",
					ext: ".gz"
				})
		],
		// * 打包去除 console.log && debugger
		esbuild: {
			pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
		},
		build: {
			outDir: "dist",
			minify: "esbuild",
			chunkSizeWarningLimit: 1500,
			rollupOptions: {
				output: {
					// Static resource classification and packaging
					chunkFileNames: "assets/js/[name]-[hash].js",
					entryFileNames: "assets/js/[name]-[hash].js",
					assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
				}
			}
		}
	}
})
