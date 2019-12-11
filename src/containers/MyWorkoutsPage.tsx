import { CircularProgress, Grid, Paper, Typography } from "@material-ui/core";
import { observer, inject } from "mobx-react";
import React from "react";
import SwimWorkoutComponent from "../components/swimWorkoutsDisplay/SwimWorkout";
import { AppStateStore } from "../configuration/stateStores/appStateStore";
import UserStateStore from "../configuration/stateStores/userStateStore";
import getAllWorkoutsFromUser from "../api/getAllWorkoutsFromUser";

export interface MyWorkoutsPageProps{
    appState?: AppStateStore;
    userState?: UserStateStore;
}

//updated
@inject("appState", "userState")
@observer
export default class MyWorkoutsPage extends React.Component<MyWorkoutsPageProps>{
    get userState(){
        return this.props.userState as UserStateStore;
    }

    get appState(){
        return this.props.appState as AppStateStore;
    }

    renderUserWorkouts(){
        if(this.appState.isLoading === false){
            console.log(":: Creating user workout components...");
            const workouts = this.userState.mySwimWorkouts.map(workout => <Grid item key = {workout.workout_id}> <SwimWorkoutComponent workout = {workout}/> </Grid>);
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
                            {this.appState.isLoading && <CircularProgress/>}

                            {!this.appState.isLoading && this.renderUserWorkouts()}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        )
    }

    async componentDidMount(){
        this.appState.isLoading = true;
        this.userState.mySwimWorkouts = await getAllWorkoutsFromUser(this.userState.currentUser.username);
        
        if(this.userState.mySwimWorkouts === null){
            this.userState.mySwimWorkouts = [];
        }

        this.appState.isLoading = false;
    }
}