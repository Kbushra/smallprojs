import { Navbar } from "../components/navbar.js";
import { IconText } from "../components/icon-text.tsx";
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
        <div id="centered-page">
            <div className="panel">
                {
                    user ?
                    <h2>Welcome, {name}.</h2> :
                    <div className="pill"><IconText link="/assets/images/warning.png" text="You must login to play" /></div>
                }
                <p>Play an innovative game where you click the text a lot of times.</p>

                <div style={{ position: "relative", display: "flex", flexDirection: "row", justifyContent: "center", marginTop: "1rem" }} onClick={user ? incrScore : () => {}}>
                    {
                        user ?
                        <>
                            <img src="/assets/images/button.png" style={{ height: "22rem" }} />
                            <p style={{ position: "absolute", top: "9rem" }}>Clicked: {score} times<br />(saves at every 10)</p>
                        </> :
                        <>
                            <img src="/assets/images/buttonlocked.png" style={{ height: "22rem" }} />
                        </>
                    }
                </div>
            </div>
        </div>
    </>);
}

createRoot(document.querySelector("#root")!).render(<MainPage />);