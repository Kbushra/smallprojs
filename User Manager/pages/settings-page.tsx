import { Navbar } from "../components/navbar.js";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { type UserInfo } from "../user-info.ts";
import { useState } from "react";

function SettingsPage(): ReactNode
{
    const userStr: string | null = localStorage.getItem("user");
    const user: UserInfo | null | undefined = userStr ? JSON.parse(userStr) : null;
    const [name, changeName] = useState(user ? user.name : "");

    async function DeleteAccount()
    {
        await fetch("/delete-account",
        {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
            method: "DELETE",
        });

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        location.pathname = "/";
    }

    async function UpdateInfo(ev: React.FocusEvent, updateName: boolean, updatePassword: boolean)
    {
        const target = ev.currentTarget as HTMLInputElement;
        changeName(target.value);

        const user: UserInfo = JSON.parse(localStorage.getItem("user")!)!;
        if (updateName) { user.name = target.value; }
        if (updatePassword) { user.password = target.value; }

        //Update SQL table
        const res: Response = await fetch("/update-user",
        {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
            method: "PUT",
            body: JSON.stringify(user)
        });

        delete user.password;

        const errorElement: HTMLElement = document.querySelector("#error")!;
        const { error, token } = await res.json();
        
        if (error) { errorElement.innerText = `Error: ${error}`; }
        else
        {
            errorElement.innerText = "";
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
        }
    }
    
    return (
    <>
        <Navbar />
        <div id="centered-page">
            <h1>Settings</h1>
            <div className="break-line"></div>
            <div className="panel">
                <h2>Manage your account</h2>
                <p id="error"></p>
                <input name="name" placeholder="Name" type="text" defaultValue={name} onBlur={(ev) => UpdateInfo(ev, true, false)} />
                <input name="password" placeholder="Password" type="password" onBlur={(ev) => UpdateInfo(ev, false, true)} />
                <button type="button" onClick={DeleteAccount}>Delete Account</button>
            </div>
        </div>
    </>);
}

createRoot(document.querySelector("#root")!).render(<SettingsPage />);