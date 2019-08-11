import { createMuiTheme, CircularProgress } from '@material-ui/core';
import { green, grey, red } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';
import Amplify from "aws-amplify";
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import config from "./config";
import './index.css';
import * as serviceWorker from './serviceWorker';
import { globalState } from './stateStores/appState';
import { observer } from 'mobx-react';
import LoadingPage from './containers/LoadingPage';

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
        },
        {
          name: "users",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        },
        {
          name: "swimWorkouts",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        }
      ]
    }
});

export const PRIMARY = green[700];
export const SECONDARY = grey[50];
export const ERROR = red[400]

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
