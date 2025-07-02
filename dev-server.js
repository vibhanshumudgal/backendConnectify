const http = require("http");
const app = require("./src/app");
const initializesocket = require("./src/helper/socket");
const port = process.env.PORT || 3000;

const server = http.createServer(app);
initializesocket(server);

server.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
