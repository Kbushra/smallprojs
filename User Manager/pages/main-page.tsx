import { Navbar } from "../components/navbar.js";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";

function MainPage({ loggedIn = false, name = "", onClick = () => {} }: { loggedIn?: boolean, name?: string, onClick?: () => void }): ReactNode
{
    return (
    <>
        <Navbar />
        <div className="centered-body">
            {
                !loggedIn ?
                <>
                    <p style={{ marginTop: "5rem", fontSize: "5rem" }}>Login to play!</p>
                    <s style={{ fontSize: "10rem" }}>Click me!</s>
                </> :
                <>
                    <p style={{ fontSize: "10rem" }} onClick={onClick}>Clicked: 0 times</p>
                </>
            }
        </div>
    </>);
}

createRoot(document.querySelector("#root")!).render(<MainPage />);