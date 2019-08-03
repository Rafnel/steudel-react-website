import React, { Fragment } from "react";
import { AppBar, Toolbar, IconButton, Button, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import AppStateStore, { appState } from "../stateStores/appState";
import { observer } from "mobx-react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { Auth } from "aws-amplify";

@observer
class HeaderBar extends React.Component<RouteComponentProps<any>>{
    handleLogout = async (event: any) => {
        await Auth.signOut();
    
        appState.navBarVisible = false;
        appState.isLoggedIn = false;
        appState.successMessage = "Logged out successfully.";
        this.props.history.push("/login");
    }
    
    render(){
        return(
            <AppBar position = "sticky">
                <Toolbar>
                    <IconButton
                        edge = "start"
                        onClick = {() => appState.navBarVisible = true}
                    >
                        <MenuIcon color = "secondary"/>
                    </IconButton>

                    {appState.isLoggedIn 
                    ? 
                    <Button style = {{marginLeft: "auto"}} size = "medium" onClick = {this.handleLogout}>
                        <Typography color = "secondary" variant = "button" display = "block">
                            Log Out
                        </Typography>
                    </Button>
                    :
                    <div style = {{marginLeft: "auto"}}>
                        <Button style = {{margin: "auto"}} size = "medium" component = {Link} to = "/signup" onClick = {() => {
                            appState.navBarVisible = false; 
                        }}>
                            <Typography color = "secondary" variant = "button" display = "block">
                                Sign up
                            </Typography>
                        </Button>

                        <Button style = {{margin: "auto"}} size = "medium" component = {Link} to = "/login" onClick = {() => {
                            appState.navBarVisible = false; 
                        }}>
                        <Typography color = "secondary" variant = "button" display = "block">
                            Log in
                        </Typography>
                        </Button>
                    </div>
                    }
                </Toolbar>
            </AppBar>
        )
    }
}

export default withRouter<RouteComponentProps<any>, any>(HeaderBar);
