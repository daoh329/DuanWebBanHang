import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

// import "./styles/global.scss";
import "./index.css";
import { App } from "./views/App";

// thư viện mdb
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { store } from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
