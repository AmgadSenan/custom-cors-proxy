import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

/**
 * حل طلبات Preflight (OPTIONS)
 */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"] || "*"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

/**
 * Custom CORS Proxy
 * الشكل:
 * /https://api.example.com/path
 */
app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost",
    changeOrigin: true,
    secure: true,
    followRedirects: true,
    router: (req) => {
      return req.originalUrl.slice(1);
    },
    onProxyRes(proxyRes, req, res) {
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
