import React, { Fragment } from 'react';
import Routes from './Routes';
import { observer } from 'mobx-react';
import MenuIcon from "@material-ui/icons/Menu";
import "./App.css";
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { IconButton, Button, Typography, Drawer, Snackbar, SnackbarContent } from '@material-ui/core';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import AppStateStore from './stateStores/appState';
import SuccessMessage from './components/SuccessMessage';

interface AppProps extends RouteComponentProps<any>{
  appState: AppStateStore;
}

@observer
class App extends React.Component<AppProps>{
  handleLogout = async (event: any) => {
    await Auth.signOut();

    this.props.appState.navBarVisible = false;
    this.props.appState.isLoggedIn = false;
    this.props.appState.successMessage = "Logged out successfully.";
    this.props.history.push("/login");
  }

  render() {
    return (
      !this.props.appState.isAuthenticating &&
      <div className="Appcontainer">
        <Drawer
          open = {this.props.appState.navBarVisible}
          onClose = {() => this.props.appState.navBarVisible = false}
        >
          <Typography variant = "h6" gutterBottom>
              &nbsp;&nbsp;Rafnel Navigation&nbsp;&nbsp;
          </Typography>
          
            <Button size = "medium" component = {Link} to = "/" onClick = {() => {
              this.props.appState.navBarVisible = false; 
            }}>
                <Typography variant = "button" display = "block">
                    Rafnel Home
                </Typography>
            </Button>

            {this.props.appState.isLoggedIn 
            ? 
              <Button size = "medium" onClick = {this.handleLogout}>
                <Typography variant = "button" display = "block">
                    Log Out
                </Typography>
              </Button>
            :
              <Fragment>
                <Button size = "medium" component = {Link} to = "/signup" onClick = {() => {
                    this.props.appState.navBarVisible = false; 
                  }}>
                  <Typography variant = "button" display = "block">
                      Signup
                  </Typography>
                </Button>

                <Button size = "medium" component = {Link} to = "/login" onClick = {() => {
                    this.props.appState.navBarVisible = false; 
                  }}>
                  <Typography variant = "button" display = "block">
                      Login
                  </Typography>
                </Button>
              </Fragment>
            }

            <Button size = "medium" component = {Link} to = "/weather" onClick = {() => {
              this.props.appState.navBarVisible = false; 
            }}>
                <Typography variant = "button" display = "block">
                    Weather
                </Typography>
                
            </Button>
        </Drawer>

        <IconButton
          onClick = {() => this.props.appState.navBarVisible = true}
          color = "primary"
        >
          <MenuIcon/>
        </IconButton>

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