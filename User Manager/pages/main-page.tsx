import { renderToString } from "react-dom/server";
import { Navbar } from "../components/navbar.tsx";

export default
`
    ${renderToString(<Navbar />)}
    <p>Login to play!</p>
`;