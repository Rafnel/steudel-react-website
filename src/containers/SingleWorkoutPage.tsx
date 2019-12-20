import React from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import { observer, inject } from "mobx-react";
import { observable } from "mobx";
import { SwimWorkout } from "../configuration/appState";
import getWorkoutByID from "../api/getWorkoutByID";
import SwimWorkoutComponent from "../components/swimWorkoutsDisplay/SwimWorkout";
import { AppStateStore } from "../configuration/stateStores/appStateStore";

export interface SingleWorkoutPageProps{
    username: string;
    workoutID: string;
    appState?: AppStateStore;
}

//updated
@inject("appState")
@observer
export default class SingleWorkoutPage extends React.Component<SingleWorkoutPageProps>{
    @observable workout: SwimWorkout = new SwimWorkout();
    async getWorkout(){
        this.appState.isLoading = true;
        this.workout = await getWorkoutByID(this.props.username, this.props.workoutID);
        this.appState.isLoading = false;
    }

    get appState(){
        return this.props.appState as AppStateStore;
    }

    render(){
        return(
            <Grid container justify = "center" alignItems = "center" direction = "column" spacing = {2}>
                <Grid item>
                    {this.appState.isLoading && <CircularProgress/>}
                    {!this.appState.isLoading && <SwimWorkoutComponent workout = {this.workout}/>}
                </Grid>
            </Grid>
        )
    }

    componentDidMount(){
        this.getWorkout();
    }
}