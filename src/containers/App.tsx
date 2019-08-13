import { Auth } from 'aws-amplify';
import { observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Routes from './Routes';
import { globalState } from '../configuration/appState';
import SuccessMessage from '../components/SuccessMessage';
import ErrorMessage from '../components/ErrorMessage';
import HeaderBar from '../components/HeaderBar';
import { ensureUserInDB } from '../configuration/loginSignup';

@observer
class App extends React.Component<RouteComponentProps<any>>{
  render() {
    return (
      !globalState.appState.isAuthenticating &&
      <div className="Appcontainer">
        <HeaderBar/>
        &nbsp;
        {globalState.appState.successMessage.length !== 0 && <SuccessMessage/>}
        {globalState.appState.errorMessage.length !== 0 && <ErrorMessage/>}

        <Routes/>
      </div>
    );
  }

  async componentDidMount(){
    try{
      await Auth.currentSession();
      globalState.appState.isLoggedIn = true;
      await ensureUserInDB();
    }
    catch(e){
      if(e !== "No current user"){
        alert(e);
      }
    }

    globalState.appState.isAuthenticating = false;
  }
}

export default withRouter<RouteComponentProps<any>, any>(App);