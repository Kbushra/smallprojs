import express from "express";
import main_page from "./pages/main-page.tsx";

function generate_html(body: string): string
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
                <link rel="icon" type="image/apng" href="favicon.apng" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link rel="stylesheet" href="/style.css" />
            </head>
            <body>
                ${body}
            </body>
        </html>
    `;
}

const app: express.Express = express();

app.use(express.static(process.cwd()));
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) =>
{
    res.send(generate_html(main_page));
});

export default app;