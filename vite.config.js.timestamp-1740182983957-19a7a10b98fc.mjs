// vite.config.js
import { defineConfig } from "file:///C:/Users/phamt/Desktop/web/mern/trello-web/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/phamt/Desktop/web/mern/trello-web/node_modules/@vitejs/plugin-react-swc/index.mjs";
import svgr from "file:///C:/Users/phamt/Desktop/web/mern/trello-web/node_modules/vite-plugin-svgr/dist/index.js";
var vite_config_default = defineConfig({
  define: {
    // cho phép sử dụng process.env
    // eslint-disable-next-line no-undef
    "process.env": process.env
  },
  plugins: [
    react(),
    svgr()
  ],
  // base: './'
  resolve: {
    alias: [
      { find: "~", replacement: "/src" }
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxwaGFtdFxcXFxEZXNrdG9wXFxcXHdlYlxcXFxtZXJuXFxcXHRyZWxsby13ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHBoYW10XFxcXERlc2t0b3BcXFxcd2ViXFxcXG1lcm5cXFxcdHJlbGxvLXdlYlxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvcGhhbXQvRGVza3RvcC93ZWIvbWVybi90cmVsbG8td2ViL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3YydcclxuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3ZncidcclxuXHJcbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGRlZmluZToge1xyXG4gICAgLy8gY2hvIHBoXHUwMEU5cCBzXHUxRUVEIGRcdTFFRTVuZyBwcm9jZXNzLmVudlxyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXHJcbiAgICAncHJvY2Vzcy5lbnYnOiBwcm9jZXNzLmVudlxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIHN2Z3IoKVxyXG4gIF0sXHJcbiAgLy8gYmFzZTogJy4vJ1xyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiBbXHJcbiAgICAgIHsgZmluZDogJ34nLCByZXBsYWNlbWVudDogJy9zcmMnIH1cclxuICAgIF1cclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFQsU0FBUyxvQkFBb0I7QUFDM1YsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUdqQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUE7QUFBQTtBQUFBLElBR04sZUFBZSxRQUFRO0FBQUEsRUFDekI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxFQUNQO0FBQUE7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEVBQUUsTUFBTSxLQUFLLGFBQWEsT0FBTztBQUFBLElBQ25DO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
