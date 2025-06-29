export default defineConfig({
  server: {
    proxy: {
      "/feedback": {
        target: "https://feedback-2uwd.onrender.com",
        changeOrigin: true,
        secure: false,
      },
      "/users": {
        target: "https://feedback-2uwd.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
