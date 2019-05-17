import React from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { CookiesProvider } from "react-cookie";

ReactDOM.render(
    <CookiesProvider>
        <Router>
            <App/>
        </Router>
    </CookiesProvider>,
    document.getElementById("root")
);
