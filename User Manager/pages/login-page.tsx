import { Navbar } from "../components/navbar.js";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { type UserInfo } from "../user-info.ts";

async function onSubmit(ev: React.SubmitEvent)
{
    ev.preventDefault();

    const data: URLSearchParams = new URLSearchParams(new FormData(ev.currentTarget as HTMLFormElement) as any);
    const res: Response = await fetch("/login",
    {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
        body: data
    });

    const errorElement: HTMLElement = document.querySelector("#error")!;
    const { error, token, user } = await res.json() as { error: string | null, token: string | null, user: UserInfo | null };

    if (error) { errorElement.innerText = `Error: ${error}`; }
    else
    {
        errorElement.innerText = "";
        location.pathname = "/";
        localStorage.setItem("token", token!);
        localStorage.setItem("user", JSON.stringify(user!));
    }
}

function LoginPage(): ReactNode
{
    return (
    <>
        <Navbar />
        <div className="centered-body">
            <form onSubmit={onSubmit}>
                <input placeholder="Name" name="name" />
                <input placeholder="Password" type="password" name="password" />
                <button type="submit">Log in!</button>
            </form>
            <p id="error"></p>
        </div>
    </>);
}

createRoot(document.querySelector("#root")!).render(<LoginPage />);