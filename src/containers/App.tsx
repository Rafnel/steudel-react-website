import { observer, inject } from 'mobx-react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Routes from './Routes';
import SuccessMessage from '../components/SuccessMessage';
import ErrorMessage from '../components/ErrorMessage';
import HeaderBar from '../components/HeaderBar';
import UIStateStore from '../configuration/stateStores/uiStateStore';
import { AppStateStore } from '../configuration/stateStores/appStateStore';
import { checkUserLoggedIn } from '../configuration/cognitoAPI';
import UserStateStore from '../configuration/stateStores/userStateStore';

export interface AppProps{
  uiState?: UIStateStore;
  appState?: AppStateStore;
  userState?: UserStateStore;
}

//updated
@inject("uiState", "appState", "userState")
@observer
class App extends React.Component<RouteComponentProps<any> & AppProps>{
  get uiState(){
    return this.props.uiState as UIStateStore;
  }

  get appState(){
    return this.props.appState as AppStateStore;
  }

  get userState(){
    return this.props.userState as UserStateStore;
  }

  render() {
    return (
        !this.appState.isAuthenticating &&
        <div className="Appcontainer">
          <HeaderBar/>
          &nbsp;
          {this.uiState.successMessage.length !== 0 && <SuccessMessage/>}
          {this.uiState.errorMessage.length !== 0 && <ErrorMessage/>}

          <Routes/>
        </div>
    );
  }

  async componentDidMount(){
    //see if there is an active session (user is logged in or not)
    let sessionStatus = await checkUserLoggedIn();

    if(sessionStatus.status === true){
      //there is a user logged in.
      this.appState.isLoggedIn = true;
      this.userState.currentUser = sessionStatus.user;
    }

    this.appState.isAuthenticating = false;
  }
}

export default withRouter<RouteComponentProps<any> & AppProps, any>(App);