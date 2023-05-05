import React from "react";
import ReactDOM from "react-dom/client";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import rootReducer from "./store";
import "./index.css";
import App from "./components/views/App";
import reportWebVitals from "./reportWebVitals";
// 리덕스에서 필요한 미들웨어
import promiseMiddleware from "redux-promise";
import ReduxThunk from "redux-thunk";

// 미들웨어를 적용한 redux store를 만드는 과정
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      {/* Provider를 이용해 리덕스 적용 */}
      <Provider store={createStoreWithMiddleware(Reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())}>
        {/* 크롬 브라우저에서 디버깅 도구를 이용할 수 있도록 하는 도구 */}
        <App />
      </Provider>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
