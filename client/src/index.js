import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.scss';
import App from './views/App';
import { Provider } from 'react-redux'
import { createStore } from 'redux';
import rootReducer from './store/reducers/rootReducer';
import reportWebVitals from './reportWebVitals';
// thư viện mdb
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

const reduxStore = createStore(rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ &&window.__REDUX_DEVTOOLS_EXTENSION__()
  );

root.render(
  <React.StrictMode>
    <Provider store={reduxStore}>
      <App />
    </Provider>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();