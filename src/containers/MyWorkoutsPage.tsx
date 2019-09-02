import React from "react";
import { Grid, Typography, Paper, CircularProgress } from "@material-ui/core";
import { getLoggedInUserWorkouts } from "../configuration/getUserData";
import { globalState } from "../configuration/appState";
import SwimWorkoutComponent from "../components/swimWorkoutsDisplay/SwimWorkout";
import { observer } from "mobx-react";

@observer
export default class MyWorkoutsPage extends React.Component{
    renderUserWorkouts(){
        if(globalState.appState.isLoading === false){
            console.log(":: Creating user workout components...");
            const workouts = globalState.mySwimWorkouts.map(workout => <Grid item key = {workout.workout_id}> <SwimWorkoutComponent workout = {workout}/> </Grid>);
            if(workouts.length === 0){
                return <Typography variant = "body1"> No workouts! </Typography>
            }
            return workouts;
        }
        else{
            return null;
        }
    }
    render(){
        return(
            <Grid direction = "column" container justify = "center" alignItems = "center" spacing = {2}>
                <Grid item>
                    <Typography variant = "h2">
                        Your Created Workouts
                    </Typography>
                </Grid>

                <Grid item>
                    <Typography variant = "body1">
                        This page will contain all workouts that you have created.<br/>
                        If you click a workout, you can get a direct link to it,<br/>
                        and you can export it as a PDF.
                    </Typography>
                </Grid>

                <Grid item>
                    <Paper style = {{padding: 10}}>
                        <Grid container direction = "column" alignItems = "center" justify = "center" spacing = {2}>
                            {globalState.appState.isLoading && <CircularProgress/>}

                            {!globalState.appState.isLoading && this.renderUserWorkouts()}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        )
    }

    componentDidMount(){
        getLoggedInUserWorkouts();
    }
}