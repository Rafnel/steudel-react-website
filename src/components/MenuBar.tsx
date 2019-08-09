import { Button, Divider, Grid, SwipeableDrawer, Typography } from "@material-ui/core";
import { observer } from "mobx-react";
import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { globalState } from "../stateStores/appState";


@observer
class MenuBar extends React.Component<RouteComponentProps<any>>{
    render(){
        return(
            <SwipeableDrawer
                open = {globalState.appState.navBarVisible}
                onOpen = {() => globalState.appState.navBarVisible = true}
                onClose = {() => globalState.appState.navBarVisible = false}
            >
                <Grid container justify = "center">
                    <Typography variant = "h6">
                        Rafnel
                    </Typography>
                </Grid>

                <Grid container justify = "center">
                    <Typography variant = "caption">
                        Version 0.85
                    </Typography>
                </Grid>
                <Divider/>
            
                <Button size = "medium" onClick = {() => {
                    globalState.appState.navBarVisible = false; 
                    this.props.history.push("/");
                }}>
                    <Typography variant = "button" display = "block">
                        Rafnel Home
                    </Typography>
                </Button>

                {globalState.appState.isLoggedIn
                 &&
                 <Button size = "medium" onClick = {() => {
                    globalState.appState.navBarVisible = false; 
                    this.props.history.push("/swim-components");
                }}>
                    <Typography variant = "button" display = "block">
                        Explore Swim Components
                    </Typography>
                </Button>}

                {globalState.appState.isLoggedIn
                 &&
                 <Button size = "medium" onClick = {() => {
                    globalState.appState.navBarVisible = false; 
                    this.props.history.push("/create-swim-component");
                }}>
                    <Typography variant = "button" display = "block">
                        Create Swim Component
                    </Typography>
                </Button>}

                {globalState.appState.isLoggedIn
                 &&
                 <Button size = "medium" onClick = {() => {
                    globalState.appState.navBarVisible = false; 
                    this.props.history.push("/create-swim-workout");
                }}>
                    <Typography variant = "button" display = "block">
                        Create Swim Workout
                    </Typography>
                </Button>}

                <Button size = "medium" onClick = {() => {
                    globalState.appState.navBarVisible = false;
                    this.props.history.push("/weather");
                }}>
                    <Typography variant = "button" display = "block">
                        Weather
                    </Typography>
                    
                </Button>

                <Grid container direction = "row">
                    <Grid item>
                        {/* ugly spacing since Drawer doesn't respect width  */}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </Grid>
                </Grid>
            </SwipeableDrawer>
        )
    }
}

export default withRouter<RouteComponentProps<any>, any>(MenuBar);