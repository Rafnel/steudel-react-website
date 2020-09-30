import { CircularProgress, Grid, Paper, Typography } from "@material-ui/core";
import { observer, inject } from "mobx-react";
import React from "react";
import SwimWorkoutComponent from "../components/swimWorkoutsDisplay/SwimWorkout";
import { AppStateStore } from "../configuration/stateStores/appStateStore";
import UserStateStore from "../configuration/stateStores/userStateStore";
import getAllWorkoutsFromUser from "../api/getAllWorkoutsFromUser";
import FoldersContainer from "../components/swimFolders/FoldersContainer";
import { SwimWorkout, SwimFolder } from "../configuration/appState";
import { workoutInFolders } from "./WorkoutsPage";
import { observable } from "mobx";
import getSwimFolder from "../api/getSwimWorkoutFolder";
import getWorkoutByID from "../api/getWorkoutByID";
import getChildFolders from "../api/getChildFolders";
import UIStateStore from "../configuration/stateStores/uiStateStore";
import { withRouter, RouteComponentProps } from "react-router-dom";

export interface WorkoutFolderPageProps extends RouteComponentProps<any>{
    appState?: AppStateStore;
    userState?: UserStateStore;
    uiState?: UIStateStore;
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

export async function updateFolderPage(owner_username: string, folder_name: string, userState: UserStateStore){
    //get the folder.
    const resp = await getSwimFolder(owner_username, folder_name);
    if(resp.length === 0){
        return;
    }
    userState.currentFolder = resp[0];
    console.log(JSON.stringify(userState.currentFolder));
    userState.childFoldersOfCurrent = await getChildFolders(owner_username, folder_name);

    //get each workout in the folder.
    //await getWorkoutsInFolder(userState.currentFolder);
}

//updated
@inject("appState", "userState", "uiState")
@observer
class WorkoutFolderPage extends React.Component<WorkoutFolderPageProps>{
    @observable loading: boolean = true;
    @observable loadingNum: boolean = true;

    get userState(){
        return this.props.userState as UserStateStore;
    }

    get appState(){
        return this.props.appState as AppStateStore;
    }

    get uiState(){
        return this.props.uiState as UIStateStore;
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
                {this.props.username === "Rafnel" && 
                    <Grid item>
                        <Typography variant = "h4">
                            Zac's Workouts
                        </Typography>
                    </Grid>
                }
                <Grid item>
                    <FoldersContainer folder = {this.props.folder_name} username = {this.props.username}/>
                </Grid>

                <Grid item>
                    <Paper style = {{padding: 10}}>
                        <Grid container direction = "column" alignItems = "center" justify = "center" spacing = {2}>
                            <Grid item>
                                {!this.loadingNum && 
                                    <Typography variant = "h6">
                                        Workouts in {this.props.username}'s {this.props.folder_name} Folder ({this.userState.currentDirWorkouts.length})
                                    </Typography>
                                }
                                {this.loadingNum && 
                                    <Typography variant = "h6">
                                        Workouts in {this.props.username}'s {this.props.folder_name} Folder
                                    </Typography>
                                }
                                
                            </Grid>

                            {this.renderUserWorkouts()}

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
        if(resp.length === 0){
            this.uiState.setErrorMessage("A folder with this name does not exist.");
            this.props.history.push("/");
            return;
        }
        this.userState.currentFolder = resp[0];
        this.loadingNum = false;
        console.log(JSON.stringify(this.userState.currentFolder));

        //get each workout in the folder.
        this.userState.currentDirWorkouts = [];
        for(let i = 0; i < this.userState.currentFolder.workouts.length; i++){
            const uName = this.userState.currentFolder.workouts[i].split(",")[0];
            const id = this.userState.currentFolder.workouts[i].split(",")[1];
            this.userState.currentDirWorkouts.push(await getWorkoutByID(uName, id));
        }

        this.loading = false;
    }
}

export default withRouter<WorkoutFolderPageProps, any>(WorkoutFolderPage);