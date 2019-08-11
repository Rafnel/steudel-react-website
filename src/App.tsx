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
import addUser from './api/addUser';
import ErrorMessage from './components/ErrorMessage';

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
      const currentUserInfo = await Auth.currentUserInfo();

      //get the logged-in user and apply their info to the currentUser object.
      await getUser(currentUserInfo.username);
      if(globalState.appState.currentUser.username === ""){
        //user doesn't exist in the db. Add them, then populate our currentUser value.
        await addUser(currentUserInfo.username);
        await getUser(currentUserInfo.username);
      }
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