import React, { Fragment } from 'react';
import Routes from './Routes';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import MenuIcon from "@material-ui/icons/Menu";
import "./App.css";
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { IconButton, Button, Typography, Drawer } from '@material-ui/core';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Auth } from 'aws-amplify';

export class MainStore{
  @observable navBarVisible: boolean = false; 
  @observable isLoggedIn: boolean = false;
  @observable isAuthenticating: boolean = true;
}

//global App.tsx state with MobX
export const mainStore: MainStore = new MainStore();

interface AppState{
  mainStore: MainStore;
}

interface AppProps{

}

@observer
class App extends React.Component<RouteComponentProps, AppState>{
  constructor(props: RouteComponentProps){
    super(props);
    this.state = {
      mainStore: mainStore
    }
  }

  handleLogout = async (event: any) => {
    await Auth.signOut();

    this.state.mainStore.navBarVisible = false;
    this.props.history.push("/login");
    this.state.mainStore.isLoggedIn = false;
  }

  render() {
    return (
      !this.state.mainStore.isAuthenticating &&
      <div className="Appcontainer">
        <Drawer
          open = {this.state.mainStore.navBarVisible}
          onClose = {() => this.state.mainStore.navBarVisible = false}
        >
          <Typography variant = "h6" gutterBottom>
              &nbsp;&nbsp;Rafnel Navigation&nbsp;&nbsp;
          </Typography>
          
            <Button size = "medium" component = {Link} to = "/" onClick = {() => {
              this.state.mainStore.navBarVisible = false; 
            }}>
                <Typography variant = "button" display = "block">
                    Rafnel Home
                </Typography>
            </Button>

            {this.state.mainStore.isLoggedIn 
            ? 
              <Button size = "medium" onClick = {this.handleLogout}>
                <Typography variant = "button" display = "block">
                    Log Out
                </Typography>
              </Button>
            :
              <Fragment>
                <Button size = "medium" component = {Link} to = "/signup" onClick = {() => {
                    this.state.mainStore.navBarVisible = false; 
                  }}>
                  <Typography variant = "button" display = "block">
                      Signup
                  </Typography>
                </Button>

                <Button size = "medium" component = {Link} to = "/login" onClick = {() => {
                    this.state.mainStore.navBarVisible = false; 
                  }}>
                  <Typography variant = "button" display = "block">
                      Login
                  </Typography>
                </Button>
              </Fragment>
            }

            <Button size = "medium" component = {Link} to = "/weather" onClick = {() => {
              this.state.mainStore.navBarVisible = false; 
            }}>
                <Typography variant = "button" display = "block">
                    Weather
                </Typography>
                
            </Button>
        </Drawer>

        <IconButton
          onClick = {() => this.state.mainStore.navBarVisible = true}
        >
          <MenuIcon/>
        </IconButton>

        <Routes />
      </div>
    );
  }

  async componentDidMount(){
    try{
      await Auth.currentSession();
      this.state.mainStore.isLoggedIn = true;
    }
    catch(e){
      if(e !== "No current user"){
        alert(e);
      }
    }

    this.state.mainStore.isAuthenticating = false;
  }
}

export default withRouter<RouteComponentProps, any>(App);