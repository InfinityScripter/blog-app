import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import {BrowserRouter} from "react-router-dom";
import { StyledEngineProvider } from '@mui/material/styles';


import {Provider} from "react-redux";
import store from "./redux/store";
import AppTheme from "./theme/AppTheme";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <>
        <StyledEngineProvider injectFirst>
        <CssBaseline enableColorScheme/>
        <AppTheme>
            <BrowserRouter>
                <Provider store={store}>
                    <App/>
                </Provider>
            </BrowserRouter>
        </AppTheme>
        </StyledEngineProvider>
    </>
);
