import { Navbar } from "../components/navbar.js";
import { useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { type UserInfo } from "../user-info.ts";
import { Tabclick } from "../tabclick.ts";
import { ObserveScalableText } from "../scaletext.ts";

function MainPage(): ReactNode
{
    const userStr: string | null = localStorage.getItem("user");
    const user: UserInfo | null | undefined = userStr ? JSON.parse(userStr) : null;

    const [name, changeName] = useState(user ? user.name : "");
    const [score, changeScore] = useState(user ? user.click_count : 0);

    async function IncrScore()
    {
        const newScore = score + 1;
        changeScore(newScore);
        
        const user: UserInfo = JSON.parse(localStorage.getItem("user")!)!;
        user.click_count = newScore;
        localStorage.setItem("user", JSON.stringify(user));

        if (newScore % 10 != 0) { return; }

        //Update SQL table
        const res: Response = await fetch("/update-user",
        {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
            method: "PUT",
            body: JSON.stringify(user)
        });

        const { error, token } = await res.json();
        if (!error) { localStorage.setItem("token", token); }
    }

    return (
    <>
        <Navbar />
        <div id="centered-page">
            <h1>Play</h1>
            <div className="break-line"></div>
            <div className="panel">
                {
                    user ?
                    <h2>Welcome, {name}.</h2> :
                    <div className="pill row-flex">
                        <img src="/assets/images/warning.png" style={{ height: "3rem" }} />
                        <p>You must login to play</p>
                    </div>
                }
                <p>Play an innovative game where you click the text a lot of times.</p>

                <div className="clicker-button" style={{ backgroundImage: `url(${user ? "./assets/images/button.png" : "./assets/images/buttonlocked.png"})` }}
                onClick={user ? IncrScore : () => {}} onKeyDown={(ev) => Tabclick(ev, user ? IncrScore : () => {})} tabIndex={0}>
                    {
                        user ? <h1 className="scalable-text" style={{ maxWidth: "18rem", pointerEvents: "none" }}>{score}</h1>
                        : <></>
                    }
                </div>
            </div>
        </div>
    </>);
}

createRoot(document.querySelector("#root")!).render(<MainPage />);
ObserveScalableText();