import express from "express";
import passwordManager from "argon2";
import database from "./database.ts";
import jwt from "jsonwebtoken";

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

function getToken(user: object): string
{
    return jwt.sign(user, process.env.PRIVATE_KEY as string, { algorithm: "RS256" });
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

    const publicUserInfo = { name: user.rows[0].name, click_count: user.rows[0].click_count } as { name: string, click_count: number };
    res.json({ error: null, token: getToken(publicUserInfo), user: publicUserInfo });
});

export default app;