import React from "react";
import ReactDOM from "react-dom/client";
/* import global styles */
import 'antd/dist/antd.css';
import 'antd/dist/antd.css';
import "./assests/scss/base.scss";
import "./index.css";
import App from "./App";
import '@quasar/extras/ionicons-v4/ionicons-v4.css';
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
