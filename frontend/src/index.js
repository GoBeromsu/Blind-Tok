import React from "react";
import ReactDOM from "react-dom/client";
<<<<<<< HEAD
import "./index.css";
import App from "./components/views/App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
=======
//import {Provider} from "react-redux";
//import {applyMiddleware, createStore} from "redux";
//import rootReducer from "./store";
import "./index.css";
import App from "./components/views/App";
import reportWebVitals from "./reportWebVitals";
// 리덕스에서 필요한 미들웨어
//import ReduxThunk from "redux-thunk";

// 미들웨어를 적용한 redux store를 만드는 과정

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    ,document.getElementById('root')
>>>>>>> 6c83a8ea0e6b9fb93b2b153f991658af432967d6
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
