import { Navbar } from "../components/navbar.js";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";

async function onSubmit(ev: React.SubmitEvent)
{
    ev.preventDefault();

    const data: URLSearchParams = new URLSearchParams(new FormData(ev.currentTarget as HTMLFormElement) as any);
    const res: Response = await fetch("/signup",
    {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
        body: data
    });

    const errorElement: HTMLElement = document.querySelector("#error")!;
    const { error } = await res.json() as { error: string };

    if (error) { errorElement.innerText = `Error: ${error}`; }
    else
    {
        errorElement.innerText = "";
        location.pathname = "/login";
    }
}

function SignupPage(): ReactNode
{
    return (
    <>
        <Navbar />
        <form onSubmit={onSubmit}>
            <input name="name" placeholder="Name" />
            <input name="password" placeholder="Password" type="password" />
            <button type="submit">Sign Up!</button>
        </form>
        <p id="error"></p>
    </>);
}

createRoot(document.querySelector("#root")!).render(<SignupPage />);