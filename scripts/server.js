import createBareServer from "@tomphttp/bare-server-node";
import express from "express";
import http from "node:http";

const PORT = process.env.PORT || 3000;
const __dirname = process.cwd();

const httpServer = http.createServer();
const app = express();

app.get("/uv/uv.config.js", (req, res) => {
  res.sendFile(__dirname + "/scripts/uv/uv.config.js");
});

app.use(express.static(__dirname + "/dist/public"));

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/public/index.html");
});

const bareServer = createBareServer("/bare/");

httpServer.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

httpServer.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

httpServer.on("listening", () => {
  console.log(`Velocity listening on http://localhost:${PORT}/`);
});

httpServer.listen({
  port: PORT,
  host: "0.0.0.0"
});
