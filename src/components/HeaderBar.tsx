import React, { Fragment } from "react";
import { AppBar, Toolbar, IconButton, Button, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import AppStateStore from "../stateStores/appState";
import { observer } from "mobx-react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { Auth } from "aws-amplify";

export interface HeaderBarProps extends RouteComponentProps<any>{
    appState: AppStateStore;
}

@observer
class HeaderBar extends React.Component<HeaderBarProps>{
    handleLogout = async (event: any) => {
        await Auth.signOut();
    
        this.props.appState.navBarVisible = false;
        this.props.appState.isLoggedIn = false;
        this.props.appState.successMessage = "Logged out successfully.";
        this.props.history.push("/login");
    }
    
    render(){
        return(
            <AppBar position = "sticky">
                <Toolbar>
                    <IconButton
                        edge = "start"
                        onClick = {() => this.props.appState.navBarVisible = true}
                    >
                        <MenuIcon color = "secondary"/>
                    </IconButton>

                    {this.props.appState.isLoggedIn 
                    ? 
                    <Button style = {{marginLeft: "auto"}} size = "medium" onClick = {this.handleLogout}>
                        <Typography color = "secondary" variant = "button" display = "block">
                            Log Out
                        </Typography>
                    </Button>
                    :
                    <div style = {{marginLeft: "auto"}}>
                        <Button style = {{margin: "auto"}} size = "medium" component = {Link} to = "/signup" onClick = {() => {
                            this.props.appState.navBarVisible = false; 
                        }}>
                            <Typography color = "secondary" variant = "button" display = "block">
                                Sign up
                            </Typography>
                        </Button>

                        <Button style = {{margin: "auto"}} size = "medium" component = {Link} to = "/login" onClick = {() => {
                            this.props.appState.navBarVisible = false; 
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

export default withRouter<HeaderBarProps, any>(HeaderBar);
