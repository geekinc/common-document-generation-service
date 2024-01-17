import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import './styling.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./i18n";


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <App />
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();



import { Provider } from "react-redux";
import { configureStore } from "./redux/store";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <Provider store={configureStore({})}>
        <React.Fragment>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <App />
            </BrowserRouter>
        </React.Fragment>
    </Provider>
);
