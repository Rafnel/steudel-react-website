import React, { Fragment } from 'react';
import Routes from './Routes';
import { observer } from 'mobx-react';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { appState } from './stateStores/appState';
import SuccessMessage from './components/SuccessMessage';
import MenuBar from './components/MenuBar';
import HeaderBar from './components/HeaderBar';

@observer
class App extends React.Component<RouteComponentProps<any>>{
  render() {
    return (
      !appState.isAuthenticating &&
      <div className="Appcontainer">
        <HeaderBar/>
        <MenuBar/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {appState.successMessage.length !== 0 && <SuccessMessage/>}

        <Routes/>
      </div>
    );
  }

  async componentDidMount(){
    try{
      await Auth.currentSession();
      appState.isLoggedIn = true;
    }
    catch(e){
      if(e !== "No current user"){
        alert(e);
      }
    }

    appState.isAuthenticating = false;
  }
}

export default withRouter<RouteComponentProps<any>, any>(App);