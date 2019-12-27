import { CircularProgress, Grid, Paper, Typography } from "@material-ui/core";
import { observer, inject } from "mobx-react";
import React from "react";
import SwimWorkoutComponent from "../components/swimWorkoutsDisplay/SwimWorkout";
import { AppStateStore } from "../configuration/stateStores/appStateStore";
import UserStateStore from "../configuration/stateStores/userStateStore";
import FoldersContainer from "../components/swimFolders/FoldersContainer";
import { SwimWorkout, SwimFolder } from "../configuration/appState";
import getSwimFolder from "../api/getSwimWorkoutFolder";
import { getWorkoutsInFolder } from "./WorkoutFolderPage";
import getWorkoutByID from "../api/getWorkoutByID";
import addNewSwimFolder from "../api/addNewSwimFolder";

export interface MyWorkoutsPageProps{
    appState?: AppStateStore;
    userState?: UserStateStore;
}

//function returns true if the workout is in one of the folders, false if not.
export function workoutInFolders(folders: SwimFolder[], workout: SwimWorkout): boolean{
    let folderKey = workout.username + "," + workout.workout_id;
    for(let i = 0; i < folders.length; i++){
        if(folders[i].workouts.includes(folderKey)){
            //this workout is in a folder.
            return true;
        }
    }

    //this workout is not in a folder.
    return false;
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
        console.log(":: Creating user workout components...");
        //filter the workouts that are in a folder out so that they don't show in the main directory.
        const workouts = this.userState.currentDirWorkouts.map(workout => <Grid item key = {workout.workout_id}> <SwimWorkoutComponent workout = {workout}/> </Grid>);
        if(workouts.length === 0){
            return <Typography variant = "body1"> No workouts! </Typography>
        }
        return workouts;
    }
    render(){
        return(
            <Grid direction = "column" container justify = "center" alignItems = "center" spacing = {2}>
                <Grid item>
                    <FoldersContainer folder = "main" username = {this.userState.currentUser.username}/>
                </Grid>

                <Grid item>
                    <Paper style = {{padding: 10}}>
                        <Grid container direction = "column" alignItems = "center" justify = "center" spacing = {2}>
                            <Grid item>
                                <Typography variant = "h6">
                                    Workouts in the Main Directory ({this.userState.currentDirWorkouts.length})
                                </Typography>
                            </Grid>

                            {this.renderUserWorkouts()}

                            {this.appState.isLoading && <CircularProgress/>}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        )
    }

    async componentDidMount(){
        this.appState.isLoading = true;
        //first, clear the current workouts so we don't get duplicates.
        this.userState.currentDirWorkouts = [];
        //ensure that they have a main folder for workouts.
        await addNewSwimFolder(this.userState.currentUser.username, "main", "none");
        //get the folder.
        const resp = await getSwimFolder(this.userState.currentUser.username, "main");
        this.userState.currentFolder = resp[0];
        console.log(JSON.stringify(this.userState.currentFolder));

        //get each workout in the folder.
        for(let i = 0; i < this.userState.currentFolder.workouts.length; i++){
            const uName = this.userState.currentFolder.workouts[i].split(",")[0];
            const id = this.userState.currentFolder.workouts[i].split(",")[1];
            this.userState.currentDirWorkouts.push(await getWorkoutByID(uName, id));
        }

        this.appState.isLoading = false;
    }
}