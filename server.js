import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

/**
 * هذا البروكسي يستقبل:
 * https://your-proxy.onrender.com/https://api.example.com/path
 */
app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost",
    changeOrigin: true,
    secure: true,
    followRedirects: true,
    router: (req) => {
      // استخراج الرابط الحقيقي من المسار
      return req.originalUrl.slice(1);
    },
    onProxyRes(proxyRes, req, res) {
      // CORS headers
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Credentials", "true");
    },
    onError(err, req, res) {
      res.status(500).json({
        error: "Proxy error",
        message: err.message,
      });
    },
  })
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Custom CORS Proxy running on port ${PORT}`);
});
