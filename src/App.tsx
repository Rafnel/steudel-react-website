import React, { Fragment } from 'react';
import Routes from './Routes';
import { observer } from 'mobx-react';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { IconButton, Button, Typography, Drawer, Snackbar, SnackbarContent } from '@material-ui/core';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import AppStateStore from './stateStores/appState';
import SuccessMessage from './components/SuccessMessage';
import MenuBar from './components/MenuBar';
import HeaderBar from './components/HeaderBar';

interface AppProps extends RouteComponentProps<any>{
  appState: AppStateStore;
}

@observer
class App extends React.Component<AppProps>{
  render() {
    return (
      !this.props.appState.isAuthenticating &&
      <div className="Appcontainer">
        <HeaderBar appState = {this.props.appState}/>
        <MenuBar appState = {this.props.appState}/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {this.props.appState.successMessage.length !== 0 && <SuccessMessage appState = {this.props.appState}/>}

        <Routes appState = {this.props.appState}/>
      </div>
    );
  }

  async componentDidMount(){
    try{
      await Auth.currentSession();
      this.props.appState.isLoggedIn = true;
    }
    catch(e){
      if(e !== "No current user"){
        alert(e);
      }
    }

    this.props.appState.isAuthenticating = false;
  }
}

export default withRouter<AppProps, any>(App);