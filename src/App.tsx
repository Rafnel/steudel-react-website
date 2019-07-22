import React from 'react';
import Routes from './Routes';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import MenuIcon from "@material-ui/icons/Menu";
import "./App.css";
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { IconButton, Button, Typography, Drawer } from '@material-ui/core';
import { NavBar } from './components/NavBar';
import { Link } from 'react-router-dom';

export class MainStore{
  @observable navBarVisible: boolean = false; 
}

interface AppProps{

}
interface AppState{
  mainStore: MainStore;
}

@observer
export default class App extends React.Component<AppProps, AppState>{
  constructor(props: AppProps){
    super(props);
    this.state = {
      mainStore: new MainStore()
    }
  }
  render() {
    return (
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
}
