import { defineConfig } from 'vite'
//@ts-ignore
import path from 'path'
import react from '@vitejs/plugin-react-swc'
import Pages from 'vite-plugin-pages'
import { visualizer } from 'rollup-plugin-visualizer'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

export default defineConfig({
    plugins: [react(), Pages({
        importMode: "sync",
        extendRoute(route, parent) {
            if (route.path === 'login' || route.path === "*") {
                // Index is unauthenticated.
                return route
            }
            // Augment the route with meta that indicates that the route requires authentication.
            return {
                ...route,
                meta: { auth: true },
            }
        }
    }), visualizer()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    server: {
        port: 3000,
        proxy: {
            "^/api": {
                target: "http://319996ua64.zicp.vip/", // 真实接口地址, 后端给的基地址
                changeOrigin: true, // 允许跨域
                secure: false,  //关键参数，不懂的自己去查
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },
    build: {
        rollupOptions: {
            // output: {
            //     manualChunks(id) {
            //         if (id.includes('node_modules')) {
            //             return id.toString().split('node_modules/')[1].split('/')[0].toString();
            //         }
            //     }
            // }
        }
    }
})
