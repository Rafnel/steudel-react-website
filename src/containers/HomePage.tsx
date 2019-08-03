import React from "react";
import { Typography, Button, Grid, CircularProgress } from "@material-ui/core";
import AppStateStore, { appState } from "../stateStores/appState";
import getRandomComponent from "../api/randomComponent";
import SwimComponentCard from "../components/SwimComponentCard";
import { observer } from "mobx-react";
import Image from 'material-ui-image';

@observer
export class HomePage extends React.Component{
    
    render(){
        return(
            <Grid container justify = "center" alignItems = "center" direction = "column" spacing = {2}>
                <Grid item>
                    <img src = {process.env.PUBLIC_URL + "/android-chrome-192x192.png"}/>
                </Grid>
                
                <Grid>
                    <Typography variant = "h5" gutterBottom>
                        <p>Component-Based Workouts</p>
                    </Typography>
                </Grid>
                
                {appState.isLoggedIn 
                 &&
                 <Grid item>
                    <Button 
                        color = "primary"
                        variant = "contained" 
                        onClick = {event => {
                            appState.isLoading = true;
                            getRandomComponent(appState);
                        }}
                    >
                        See a random swim component!
                    </Button>
                 </Grid>
                }

                {appState.currentComponent.username.length !== 0 && appState.isLoggedIn
                 &&
                 <Grid item>
                     <SwimComponentCard/>
                 </Grid>}

                {appState.isLoading && <CircularProgress/>}
            </Grid>
        )
    }
}