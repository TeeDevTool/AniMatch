// external module
import React from "react";
import ReactDOM from "react-dom/client";

// internal module
import App from "./App";

// css
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
