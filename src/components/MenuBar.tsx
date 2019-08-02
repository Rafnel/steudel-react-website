import React, { Fragment } from "react";
import { Drawer, Typography, Button } from "@material-ui/core";
import AppStateStore from "../stateStores/appState";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { Auth } from "aws-amplify";
import { observer } from "mobx-react";

export interface MenuBarProps extends RouteComponentProps<any>{
    appState: AppStateStore;
}

@observer
class MenuBar extends React.Component<MenuBarProps>{
    render(){
        return(
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

                <Button size = "medium" component = {Link} to = "/weather" onClick = {() => {
                this.props.appState.navBarVisible = false; 
                }}>
                    <Typography variant = "button" display = "block">
                        Weather
                    </Typography>
                    
                </Button>
            </Drawer>
        )
    }
}

export default withRouter<MenuBarProps, any>(MenuBar);