import { AppBar, Button, IconButton, Toolbar, Typography, Icon, Tooltip, Grid } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Auth } from "aws-amplify";
import { observer } from "mobx-react";
import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { globalState, resetState } from "../stateStores/appState";
import CreateButton from "./CreateButton";


@observer
class HeaderBar extends React.Component<RouteComponentProps<any>>{
    handleLogout = async (event: any) => {
        await Auth.signOut();
    
        //reset the app's state since the user logged out.
        resetState();
        globalState.appState.successMessage = "Logged out successfully.";
        this.props.history.push("/login");
    }
    
    render(){
        return(
            <AppBar position = "sticky">
                <Toolbar>
                    <IconButton
                        edge = "start"
                        onClick = {() => globalState.appState.navBarVisible = true}
                    >
                        <MenuIcon color = "secondary"/>
                    </IconButton>

                    {globalState.appState.isLoggedIn
                     &&
                     <Tooltip title = "Explore Community Components">
                        <IconButton 
                            size = "medium"
                            onClick = {() => this.props.history.push("/swim-components")}
                        >
                            <Icon color = "secondary">explore</Icon>
                        </IconButton>
                     </Tooltip>
                    }

                    {globalState.appState.isLoggedIn && <CreateButton/>}

                    {globalState.appState.isLoggedIn 
                    ? 
                    <Button style = {{marginLeft: "auto"}} size = "medium" onClick = {this.handleLogout}>
                        <Typography color = "secondary" variant = "button" display = "block">
                            Log Out
                        </Typography>
                    </Button>
                    :
                    <div style = {{marginLeft: "auto"}}>
                        <Button style = {{margin: "auto"}} size = "medium" component = {Link} to = "/signup" onClick = {() => {
                            globalState.appState.navBarVisible = false; 
                        }}>
                            <Typography color = "secondary" variant = "button" display = "block">
                                Sign up
                            </Typography>
                        </Button>

                        <Button style = {{margin: "auto"}} size = "medium" component = {Link} to = "/login" onClick = {() => {
                            globalState.appState.navBarVisible = false; 
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
