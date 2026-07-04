import express, { type NextFunction } from "express";
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
                <link href='https://fonts.googleapis.com/css?family=Geist' rel='stylesheet'>
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
    res.status(200).send(generateHtml("/pages_dest/main-page.js"));
});

app.get("/signup", (req: express.Request, res: express.Response) =>
{
    res.status(200).send(generateHtml("/pages_dest/signup-page.js"));
});

app.get("/login", (req: express.Request, res: express.Response) =>
{
    res.status(200).send(generateHtml("/pages_dest/login-page.js"));
});

app.get("/settings", (req: express.Request, res: express.Response) =>
{
    res.status(200).send(generateHtml("/pages_dest/settings-page.js"));
});

app.get("/*path", (req: express.Request, res: express.Response) =>
{
    res.status(200).send(generateHtml("/pages_dest/main-page.js"));
});

app.use((req: express.Request, res: express.Response, next: NextFunction) =>
{
    const auth = req.headers.authorization;
    if (!auth || auth.split(" ").length <= 1) { next(); return; }

    try 
    {
        res.locals.token = auth.split(" ")[1];
        res.locals.user = parseToken(res.locals.token);
    }
    catch
    {
        res.sendStatus(401);
        return;
    }
    
    next();
});

app.delete("/delete-account", (req: express.Request, res: express.Response) =>
{
    console.log(`Deleting user ${res.locals.user.name}`);

    database.query
    (`
        DELETE FROM users
        WHERE id = $1;
    `, [res.locals.user.id]);

    res.sendStatus(204);
});

app.post("/signup", async (req: express.Request, res: express.Response) =>
{
    const { name, password } = req.body as { name: string, password: string };
    console.log(`Signing up as ${name}`);

    if (!name)
    {
        res.status(403).json({ error: "Invalid username!" });
        return;
    }

    if (!password)
    {
        res.status(403).json({ error: "Invalid password!" });
        return;
    }

    if (name.length > 255)
    {
        res.status(403).json({ error: "Username too long!" });
        return;
    }

    if (password.length > 255)
    {
        res.status(403).json({ error: "Password too long!" });
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
        res.status(403).json({ error: "Username already exists!" });
        return;
    }
    
    const hashPassword: string = await passwordManager.hash(password);
    if (!hashPassword)
    {
        res.status(403).json({ error: "Invalid password!" });
        return;
    }

    await database.query(
    `
        INSERT INTO users (name, hash_password)
        VALUES ($1, $2);
    `, [name, hashPassword]);

    res.status(201).json({ error: null });
});

app.post("/login", async (req: express.Request, res: express.Response) =>
{
    const { name, password } = req.body as { name: string, password: string };
    console.log(`Logging in as ${name}`);

    if (name === "")
    {
        res.status(403).json({ error: "Empty username!", token: null, user: null });
        return;
    }

    if (password === "")
    {
        res.status(403).json({ error: "Empty password!", token: null, user: null });
        return;
    }

    if (name.length > 255)
    {
        res.status(403).json({ error: "Username too long!", token: null, user: null });
        return;
    }

    if (password.length > 255)
    {
        res.status(403).json({ error: "Password too long!", token: null, user: null });
        return;
    }

    const existingUsers = await database.query
    (`
        SELECT *
        FROM users
        WHERE name = $1;
    `, [name]);

    if (existingUsers.rowCount! === 0)
    {
        res.status(403).json({ error: "Wrong username or password!", token: null, user: null });
        return;
    }
    
    const userRecord = existingUsers.rows[0];
    const correctPassword: boolean = await passwordManager.verify(userRecord.hash_password, password);
    if (!correctPassword)
    {
        res.status(403).json({ error: "Wrong username or password!", token: null, user: null });
        return;
    }

    const user: UserInfo = { id: userRecord.id, name: userRecord.name, click_count: userRecord.click_count } as UserInfo;
    res.status(200).json({ error: null, token: generateToken(user), user: user });
});

app.put("/update-user", rateLimit({ windowMs: 1000, limit: 50 }), async (req: express.Request, res: express.Response) =>
{
    const maxScoreUpdate: number = 10;
    const user = res.locals.user as UserInfo;
    const newUser = req.body as UserInfo;
    console.log(`Updating user ${newUser.name}`);

    if (Math.abs(newUser.click_count - user.click_count) > maxScoreUpdate || newUser.id != user.id)
    {
        res.status(403).json({ error: "Illegal user modification!", token: null });
        return;
    }

    const existingUsers = await database.query
    (`
        SELECT *
        FROM users
        WHERE name = $1;
    `, [newUser.name]);

    if (newUser.name === "")
    {
        res.status(403).json({ error: "Empty username!", token: null });
        return;
    }

    if (newUser.name != user.name && existingUsers.rowCount! > 0)
    {
        res.status(403).json({ error: "Name already in use!", token: null });
        return;
    }

    await database.query
    (`
        UPDATE users
        SET name = $1, click_count = $2
        WHERE id = $3;
    `, [newUser.name, newUser.click_count, newUser.id]);
    
    if (newUser.password)
    {
        const hashPassword: string = await passwordManager.hash(newUser.password);
        await database.query
        (`
            UPDATE users
            SET hash_password = $1
            WHERE id = $2;
        `, [hashPassword, newUser.id]);

        delete newUser.password;
    }

    res.status(200).json({ error: null, token: generateToken(newUser) });
});

export default app;