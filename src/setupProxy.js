// import 'dotenv/config';
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.BACKEND_URL,
      changeOrigin: true,
    })
  );
  app.use(
    '/pusher/auth',
    createProxyMiddleware({
      target: process.env.BACKEND_URL,
      changeOrigin: true,
      secure: false,
    })
  );
};