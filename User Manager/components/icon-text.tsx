import type { ReactNode } from "react";

export function IconText({ link, text, imgStyle, pStyle, style }:
{ link: string, text: string, imgStyle?: object, pStyle?: object, style?: object }): ReactNode
{
    return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", ...style }}>
            <img src={link} style={{ height: "3rem", ...imgStyle }}/>
            <p style={{ textAlign: "center", ...pStyle }}>{text}</p>
        </div>
    );
}