import express from "express";
import passwordManager from "argon2";
import database from "./database.ts";
import jwt from "jsonwebtoken";
import { rateLimit } from "express-rate-limit";
import { type UserInfo } from "./user-info.ts";

function generateHtml(scriptPath: string): string
{
    return `
        <!doctype html>
        <html>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <meta property="og:type" content="website" />
                <meta property="og:title" content="User Manager" />
                <meta
                    property="og:description"
                    content="Managing user login/signup, testing backend."
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="User Manager" />
                <meta
                    name="twitter:description"
                    content="Managing user login/signup, testing backend."
                />

                <title>User Manager</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link rel="stylesheet" href="/style.css" />
            </head>
            <body>
                <div id="root"></div>
                <script src=${scriptPath} type="module"></script>
            </body>
        </html>
    `;
}

function generateToken(user: UserInfo): string
{
    return jwt.sign(user, process.env.PRIVATE_KEY as string, { algorithm: "HS256" });
}

function parseToken(token: string): UserInfo
{
    return jwt.verify(token, process.env.PRIVATE_KEY as string, { algorithms: ["HS256"] }) as UserInfo;
}

const app: express.Express = express();

app.use(express.static(process.cwd()));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) =>
{
    res.send(generateHtml("/pages_dest/main-page.js"));
});

app.get("/signup", (req: express.Request, res: express.Response) =>
{
    res.send(generateHtml("/pages_dest/signup-page.js"));
});

app.get("/login", (req: express.Request, res: express.Response) =>
{
    res.send(generateHtml("/pages_dest/login-page.js"));
});

app.get("/logout", (req: express.Request, res: express.Response) =>
{
    res.send(generateHtml("/pages_dest/clear.js"));
});

app.get("/delete-account", (req: express.Request, res: express.Response) =>
{
    res.send(generateHtml("/pages_dest/clear.js"));
});

app.post("/signup", async (req: express.Request, res: express.Response) =>
{
    const { name, password } = req.body as { name: string, password: string };

    if (!name)
    {
        res.json({ error: "Invalid username!" });
        return;
    }

    if (!password)
    {
        res.json({ error: "Invalid password!" });
        return;
    }

    if (name.length > 255)
    {
        res.json({ error: "Username too long!" });
        return;
    }

    if (password.length > 255)
    {
        res.json({ error: "Password too long!" });
        return;
    }

    const existingUsers = await database.query
    (`
        SELECT name
        FROM users
        WHERE name = $1;
    `, [name]);

    if (existingUsers.rowCount! > 0)
    {
        res.json({ error: "Username already exists!" });
        return;
    }
    
    const hashPassword: string = await passwordManager.hash(password);
    if (!hashPassword)
    {
        res.json({ error: "Invalid password!" });
        return;
    }

    await database.query(
    `
        INSERT INTO users (name, hash_password)
        VALUES ($1, $2);
    `, [name, hashPassword]);

    res.json({ error: null });
});

app.post("/login", async (req: express.Request, res: express.Response) =>
{
    const { name, password } = req.body as { name: string, password: string };

    if (!name)
    {
        res.json({ error: "Invalid username!", token: null, user: null });
        return;
    }

    if (!password)
    {
        res.json({ error: "Invalid password!", token: null, user: null });
        return;
    }

    if (name.length > 255)
    {
        res.json({ error: "Username too long!", token: null, user: null });
        return;
    }

    if (password.length > 255)
    {
        res.json({ error: "Password too long!", token: null, user: null });
        return;
    }

    const user = await database.query
    (`
        SELECT *
        FROM users
        WHERE name = $1;
    `, [name]);

    if (user.rowCount! == 0)
    {
        res.json({ error: "Wrong username or password!", token: null, user: null });
        return;
    }
    
    const correctPassword: boolean = await passwordManager.verify(user.rows[0].hash_password, password);
    if (!correctPassword)
    {
        res.json({ error: "Wrong username or password!", token: null, user: null });
        return;
    }

    const publicUserInfo: UserInfo = { id: user.rows[0].id, name: user.rows[0].name, click_count: user.rows[0].click_count } as UserInfo;
    res.json({ error: null, token: generateToken(publicUserInfo), user: publicUserInfo });
});

app.post("/update-score", rateLimit({ windowMs: 1000, limit: 50 }), async (req: express.Request, res: express.Response) =>
{
    const maxScoreUpdate: number = 10;
    const publicUserInfo: UserInfo = parseToken(req.body.token as string);
    if (Math.abs(req.body.score - publicUserInfo.click_count) > maxScoreUpdate) { res.send(req.body.token); return; }

    await database.query
    (`
        UPDATE users
        SET click_count = $1
        WHERE id = $2;
    `, [req.body.score, publicUserInfo.id]);

    const newUserInfo: UserInfo = { id: publicUserInfo.id, name: publicUserInfo.name, click_count: req.body.score } as UserInfo;
    res.send(generateToken(newUserInfo));
});

export default app;