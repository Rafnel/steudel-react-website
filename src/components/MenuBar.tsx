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
                <Typography variant = "h6">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rafnel&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Typography>

                <Grid container justify = "center">
                    <Typography variant = "caption">
                        Version 0.65
                    </Typography>
                </Grid>
                <Divider/>
            
                <Button size = "medium" component = {Link} to = "/" onClick = {() => {
                globalState.appState.navBarVisible = false; 
                }}>
                    <Typography variant = "button" display = "block">
                        Rafnel Home
                    </Typography>
                </Button>

                <Button size = "medium" component = {Link} to = "/weather" onClick = {() => {
                globalState.appState.navBarVisible = false; 
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