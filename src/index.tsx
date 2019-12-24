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
import { Provider } from 'mobx-react';
import UIStateStore from './configuration/stateStores/uiStateStore';
import UserStateStore from './configuration/stateStores/userStateStore';
import { AppStateStore } from './configuration/stateStores/appStateStore';
import AddFolderModalStateStore from './configuration/stateStores/addFolderModalStateStore';

export const PRIMARY = green[900];
export const SECONDARY = green[200];
export const ERROR = red[400];
export const ICONS = grey[50];

const breakPointValues = {
  xs: 0,
  sm: 600,
  md: 800,
  lg: 1280,
  xl: 1920
}

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
  },
  breakpoints: {values: breakPointValues}
});

ReactDOM.render(
  <BrowserRouter>
    <Provider 
      uiState = {new UIStateStore()} 
      userState = {new UserStateStore()} 
      appState = {new AppStateStore()}
      addFolderModalState = {new AddFolderModalStateStore()}
    >
      <ThemeProvider theme = {theme}>
        <LoadingPage/>
        <App/>
      </ThemeProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
    
);
  

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
