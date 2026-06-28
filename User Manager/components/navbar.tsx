import type { ReactNode } from "react";
import reactDom from "react-dom";

export function Navbar(): ReactNode
{
    return (
        <div id="navbar">
            <a href="/">Play</a>
            <a href="/signup">Sign Up</a>
            <a href="/login">Log in</a>
        </div>
    );
}