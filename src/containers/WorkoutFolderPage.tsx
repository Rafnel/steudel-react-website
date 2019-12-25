import { CircularProgress, Grid, Paper, Typography } from "@material-ui/core";
import { observer, inject } from "mobx-react";
import React from "react";
import SwimWorkoutComponent from "../components/swimWorkoutsDisplay/SwimWorkout";
import { AppStateStore } from "../configuration/stateStores/appStateStore";
import UserStateStore from "../configuration/stateStores/userStateStore";
import getAllWorkoutsFromUser from "../api/getAllWorkoutsFromUser";
import FoldersContainer from "../components/swimFolders/FoldersContainer";
import { SwimWorkout, SwimFolder } from "../configuration/appState";
import { workoutInFolders } from "./MyWorkoutsPage";
import { observable } from "mobx";
import getSwimFolder from "../api/getSwimWorkoutFolder";
import getWorkoutByID from "../api/getWorkoutByID";

export interface WorkoutFolderPageProps{
    appState?: AppStateStore;
    userState?: UserStateStore;
    username: string;
    folder_name: string;
}

export async function getWorkoutsInFolder(folder: SwimFolder): Promise<SwimWorkout[]>{
    let workouts: SwimWorkout[] = [];
    
    for(let i = 0; i < folder.workouts.length; i++){
        const uName = folder.workouts[i].split(",")[0];
        const id = folder.workouts[i].split(",")[1];
        workouts.push(await getWorkoutByID(uName, id));
    }

    return workouts;
}

//updated
@inject("appState", "userState")
@observer
export default class WorkoutFolderPage extends React.Component<WorkoutFolderPageProps>{
    @observable loading: boolean = true;

    get userState(){
        return this.props.userState as UserStateStore;
    }

    get appState(){
        return this.props.appState as AppStateStore;
    }

    renderUserWorkouts(){
        console.log(":: Creating user workout components...");
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
                    <FoldersContainer folder = {this.props.folder_name} username = {this.props.username}/>
                </Grid>

                <Grid item>
                    <Paper style = {{padding: 10}}>
                        <Grid container direction = "column" alignItems = "center" justify = "center" spacing = {2}>
                            <Grid item>
                                <Typography variant = "h6">
                                    Workouts in {this.props.username}'s {this.props.folder_name} Folder ({this.userState.currentFolder.workouts.length})
                                </Typography>
                            </Grid>

                            {!this.loading && this.renderUserWorkouts()}

                            {this.loading && <CircularProgress/>}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        )
    }

    async componentDidMount(){
        //get the folder.
        const resp = await getSwimFolder(this.props.username, this.props.folder_name);
        this.userState.currentFolder = resp[0];
        console.log(JSON.stringify(this.userState.currentFolder));

        //get each workout in the folder.
        this.userState.currentDirWorkouts = await getWorkoutsInFolder(this.userState.currentFolder);

        this.loading = false;
    }
}