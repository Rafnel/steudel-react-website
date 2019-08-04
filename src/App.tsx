import { Auth } from 'aws-amplify';
import { observer } from 'mobx-react';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-light/theme.css';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import getUser from './api/getUser';
import HeaderBar from './components/HeaderBar';
import MenuBar from './components/MenuBar';
import SuccessMessage from './components/SuccessMessage';
import Routes from './Routes';
import { globalState } from "./stateStores/appState";

@observer
class App extends React.Component<RouteComponentProps<any>>{
  render() {
    return (
      !globalState.appState.isAuthenticating &&
      <div className="Appcontainer">
        <HeaderBar/>
        <MenuBar/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {globalState.appState.successMessage.length !== 0 && <SuccessMessage/>}

        <Routes/>
      </div>
    );
  }

  async componentDidMount(){
    try{
      await Auth.currentSession();
      globalState.appState.isLoggedIn = true;
      const currentUserInfo = await Auth.currentUserInfo();

      //get the logged-in user and apply their info to the currentUser object.
      getUser(currentUserInfo.username);
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