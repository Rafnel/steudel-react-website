import React from "react";
import { Typography, Button, Grid } from "@material-ui/core";
import AppStateStore from "../stateStores/appState";
import getRandomComponent from "../api/randomComponent";
import SwimComponentCard from "../components/SwimComponentCard";
import { observer } from "mobx-react";

export interface HomePageProps{
    appState: AppStateStore;
}

@observer
export class HomePage extends React.Component<HomePageProps>{
    
    render(){
        return(
            <Grid container justify = "center" alignItems = "center" direction = "column" spacing = {2}>
                <Grid item>
                    <Typography variant = "h2">
                        Rafnel
                    </Typography>
                </Grid>
                
                <Grid>
                    <Typography variant = "h5" gutterBottom>
                        <p>Component-Based Workouts</p>
                    </Typography>
                </Grid>
                
                {this.props.appState.isLoggedIn 
                 &&
                 <Grid item>
                    <Button 
                        color = "primary"
                        variant = "contained" 
                        onClick = {event => {
                            getRandomComponent(this.props.appState);
                        }}
                    >
                        See a random swim component!
                    </Button>
                 </Grid>
                }

                {this.props.appState.currentComponent.username.length !== 0
                 &&
                 <Grid item>
                     <SwimComponentCard appState = {this.props.appState}/>
                 </Grid>}
            </Grid>
        )
    }
}