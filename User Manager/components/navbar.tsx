import type { ReactNode } from "react";

function Logout()
{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    location.pathname = "/";
}

export function Navbar(): ReactNode
{
    return (
        <div id="navbar">
            <a href="/">Play</a>
            {
                localStorage.getItem("user") ?
                <>
                    <div >
                        <a className="row-flex" href="/settings">
                            <img src="/assets/images/settings.png" style={{ height: "3rem" }} />
                            Settings
                        </a>
                    </div>
                    <div className="row-flex">
                        <a className="row-flex" href="/" onClick={Logout}>
                            <img src="/assets/images/logout.png" style={{ height: "3rem" }} />
                            Log Out
                        </a>
                    </div>
                </> :
                <>
                    <div className="row-flex">
                        <a className="row-flex" href="/signup">
                            <img src="/assets/images/signup.png" style={{ height: "3rem" }} />
                            Sign Up
                        </a>
                    </div>
                    <div className="row-flex">
                        <a className="row-flex" href="/login">
                            <img src="/assets/images/login.png" style={{ height: "3rem" }} />
                            Log In
                        </a>
                    </div>
                </>
            }
        </div>
    );
}