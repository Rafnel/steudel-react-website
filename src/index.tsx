import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Amplify from "aws-amplify";
import config from "./config";
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from "react-router-dom";
import AppStateStore from './stateStores/appState';
import { createMuiTheme } from '@material-ui/core';
import { green, grey } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';

Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    API: {
      endpoints:[
        {
          name: "swimComponents",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        }
      ]
    }
});

export const PRIMARY = green[700];
export const SECONDARY = grey[50];

const theme = createMuiTheme({
  palette: {
    primary: {
      main: PRIMARY
    },
    secondary: {
      main: SECONDARY
    },
  }
});

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme = {theme}>
      <App appState = {new AppStateStore()}/>
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById("root")
    
);
  

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
