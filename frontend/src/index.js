import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "antd/dist/antd.css";
import "rsuite/dist/styles/rsuite-default.css";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
serviceWorkerRegistration.register();
