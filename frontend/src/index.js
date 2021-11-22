import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "rsuite/dist/styles/rsuite-default.css";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import store from "./store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
