import React from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { SwimWorkout, globalState } from "../configuration/appState";
import getWorkoutByID from "../api/getWorkoutByID";
import SwimWorkoutComponent from "../components/swimWorkoutsDisplay/SwimWorkout";

export interface SingleWorkoutPageProps{
    username: string;
    workoutID: string;
}

@observer
export default class SingleWorkoutPage extends React.Component<SingleWorkoutPageProps>{
    @observable workout: SwimWorkout = new SwimWorkout();
    async getWorkout(){
        globalState.appState.isLoading = true;
        this.workout = await getWorkoutByID(this.props.username, this.props.workoutID);
        globalState.appState.isLoading = false;
    }
    render(){
        return(
            <Grid container justify = "center" alignItems = "center" direction = "column">
                <Grid item>
                    {globalState.appState.isLoading && <CircularProgress/>}
                    {!globalState.appState.isLoading && <SwimWorkoutComponent workout = {this.workout}/>}
                </Grid>
            </Grid>
        )
    }

    componentDidMount(){
        this.getWorkout();
    }
}