import http from "http";
import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { configDotenv } from "dotenv";

configDotenv();

const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.text());
app.use(express.static( join(dirname(fileURLToPath(import.meta.url)), "Frontend") ));

router.post("/send", async (req: express.Request, res: express.Response) =>
{
    const fetched = await fetch("https://postmail.invotes.com/send",
    {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams
        ({
            access_token: process.env.USER_KEY! as string,
            subject: req.body.subject! as string,
            text: `Message from ${req.body.from}\n\n` + req.body.message! as string,
            from: req.body.from! as string
        })
    });

    res.sendStatus(fetched.status);
});

app.use(router);
const server = http.createServer(app);
server.listen(3000, "0.0.0.0", () => console.log("Running..."));