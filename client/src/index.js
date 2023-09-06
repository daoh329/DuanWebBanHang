import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.scss";
import App from "./views/App";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./store/reducers/rootReducer";
import { BrowserRouter } from "react-router-dom";

// thư viện mdb
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

const reduxStore = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={reduxStore}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
