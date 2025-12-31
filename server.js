import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.all("/*", async (req, res) => {
  const targetUrl = req.originalUrl.slice(1);

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined
      },
      body: ["GET", "HEAD"].includes(req.method)
        ? undefined
        : JSON.stringify(req.body)
    });

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (err) {
    res.status(500).json({
      error: "Proxy error",
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Custom CORS Proxy running on port ${PORT}`);
});
