import React, { Fragment } from "react";
import { Drawer, Typography, Button, SwipeableDrawer, Divider, Grid } from "@material-ui/core";
import AppStateStore, { appState } from "../stateStores/appState";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { Auth } from "aws-amplify";
import { observer } from "mobx-react";

@observer
class MenuBar extends React.Component<RouteComponentProps<any>>{
    render(){
        return(
            <SwipeableDrawer
                open = {appState.navBarVisible}
                onOpen = {() => appState.navBarVisible = true}
                onClose = {() => appState.navBarVisible = false}
            >
                <Typography variant = "h6">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rafnel&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Typography>

                <Grid container justify = "center">
                    <Typography variant = "caption">
                        Version 0.5
                    </Typography>
                </Grid>
                <Divider/>
            
                <Button size = "medium" component = {Link} to = "/" onClick = {() => {
                appState.navBarVisible = false; 
                }}>
                    <Typography variant = "button" display = "block">
                        Rafnel Home
                    </Typography>
                </Button>

                <Button size = "medium" component = {Link} to = "/weather" onClick = {() => {
                appState.navBarVisible = false; 
                }}>
                    <Typography variant = "button" display = "block">
                        Weather
                    </Typography>
                    
                </Button>
            </SwipeableDrawer>
        )
    }
}

export default withRouter<RouteComponentProps<any>, any>(MenuBar);