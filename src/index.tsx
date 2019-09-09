import { createMuiTheme } from '@material-ui/core';
import { green, grey, red, brown } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from './containers/App';
import './index.css';
import * as serviceWorker from './serviceWorker';
import LoadingPage from './containers/LoadingPage';

export const PRIMARY = green[900];
export const SECONDARY = green[600];
export const ERROR = red[400];
export const ICONS = grey[50];

const theme = createMuiTheme({
  palette: {
    primary: {
      main: PRIMARY
    },
    secondary: {
      main: SECONDARY
    },
    error: {
      main: ICONS
    }
  }
});

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme = {theme}>
      <LoadingPage/>
      <App/>
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById("root")
    
);
  

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
