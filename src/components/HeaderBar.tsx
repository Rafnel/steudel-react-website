import { AppBar, Button, IconButton, Toolbar, Typography, Icon, Tooltip } from "@material-ui/core";
import { Auth } from "aws-amplify";
import { observer } from "mobx-react";
import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { globalState, resetState } from "../configuration/appState";
import CreateButton from "./buttons/CreateButton";
import HomeButton from "./buttons/HomeButton";
import WeatherButton from "./buttons/WeatherButton";
import ExploreButton from "./buttons/ExploreButton";


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
                    <HomeButton/>

                    {globalState.appState.isLoggedIn && <ExploreButton/>}

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

                    <WeatherButton/>
                </Toolbar>
            </AppBar>
        )
    }
}

export default withRouter<RouteComponentProps<any>, any>(HeaderBar);
