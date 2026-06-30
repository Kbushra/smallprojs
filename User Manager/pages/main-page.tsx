import { Navbar } from "../components/navbar.js";
import { useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { type UserInfo } from "../user-info.ts";

function MainPage(): ReactNode
{
    const token: string | null = localStorage.getItem("token");
    const userStr: string | null = localStorage.getItem("user");
    const user: UserInfo | null | undefined = userStr ? JSON.parse(userStr) : null;

    const [name, changeName] = useState(user ? user.name : "");
    const [score, changeScore] = useState(user ? user.click_count : 0);

    async function incrScore()
    {
        const newScore = score + 1;
        changeScore(newScore);
        if (newScore % 10 != 0) { return; }

        //Update SQL table
        const res: Response = await fetch("/update-score",
        {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
            method: "PUT",
            body: JSON.stringify({ score: newScore } as { score: number })
        });

        //Update token
        const newToken = await res.text();
        localStorage.setItem("token", newToken);

        //Update user
        const user: UserInfo = JSON.parse(localStorage.getItem("user")!)!;
        user.click_count = newScore;
        localStorage.setItem("user", JSON.stringify(user));
    }

    return (
    <>
        <Navbar />
        <div className="centered-body">
            {
                user ?
                <>
                    <p style={{ marginTop: "5rem", fontSize: "5rem" }}>Welcome, {name}.</p>
                    <p style={{ fontSize: "10rem", userSelect: "none" }} onClick={incrScore}>Clicked: {score} times<br />(saves at every 10)</p>
                </> :
                <>
                    <p style={{ marginTop: "5rem", fontSize: "5rem" }}>Login to play!</p>
                    <s style={{ fontSize: "10rem" }}>Click me!</s>
                </>
            }
        </div>
    </>);
}

createRoot(document.querySelector("#root")!).render(<MainPage />);