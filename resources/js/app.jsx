import React from "react";
import { createRoot } from "react-dom/client";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

const root = createRoot(document.getElementById("app"));

if (window.location.pathname === "/dashboard") {
    root.render(<Dashboard />);
} else {
    root.render(<Login />);
}
