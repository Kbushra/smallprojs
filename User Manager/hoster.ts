import http from "http";
import app from "./app.tsx";

const server = http.createServer(app);
server.listen(3000, () => { console.log("Running app on localhost:3000"); });