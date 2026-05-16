import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

