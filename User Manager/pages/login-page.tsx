import { Navbar } from "../components/navbar.js";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";

function onSubmit()
{
    
}

function LoginPage(): ReactNode
{
    return (
    <>
        <Navbar />
        <div className="centered-body">
            <form onSubmit={onSubmit}>
                <input placeholder="Name" />
                <input placeholder="Password" type="password" />
                <button type="submit">Log in!</button>
            </form>
        </div>
    </>);
}

createRoot(document.querySelector("#root")!).render(<LoginPage />);