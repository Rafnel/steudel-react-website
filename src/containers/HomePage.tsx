import { Button, CircularProgress, Grid, Typography } from "@material-ui/core";
import { observer } from "mobx-react";
import React from "react";
import getRandomComponent from "../api/randomComponent";
import SwimComponentCard from "../components/SwimComponentCard";
import { globalState } from "../stateStores/appState";

@observer
export class HomePage extends React.Component{
    
    render(){
        return(
            <Grid container justify = "center" alignItems = "center" direction = "column" spacing = {2}>
                <Grid item>
                    <img src = {process.env.PUBLIC_URL + "/android-chrome-192x192.png"} alt = "logo"/>
                </Grid>
                
                <Grid>
                    <Typography variant = "h5" gutterBottom>
                        <p>Component-Based Workouts</p>
                    </Typography>
                </Grid>
                
                {globalState.appState.isLoggedIn 
                 &&
                 <Grid item>
                    <Button 
                        color = "primary"
                        variant = "contained" 
                        onClick = {event => {
                            globalState.appState.isLoading = true;
                            getRandomComponent();                            
                        }}
                    >
                        See a random swim component!
                    </Button>
                 </Grid>
                }

                {globalState.appState.isLoading && <CircularProgress/>}

                {globalState.appState.currentComponent.username.length !== 0 && globalState.appState.isLoggedIn
                 &&
                 <Grid item>
                     <SwimComponentCard/>
                 </Grid>}
            </Grid>
        )
    }
}