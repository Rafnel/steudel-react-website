import React from "react";
import { observer, inject } from "mobx-react";
import { Grid, Button, Paper, Container, Box, Icon, Typography, Divider, CircularProgress, IconButton, Tooltip, DialogTitle, Dialog, DialogContent, TextField, DialogActions, FormControlLabel, Checkbox } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";
import { AppStateStore } from "../../configuration/stateStores/appStateStore";
import UserStateStore from "../../configuration/stateStores/userStateStore";
import { observable } from "mobx";
import getSwimFolder from "../../api/getSwimWorkoutFolder";
import { SwimFolder, SwimWorkout } from "../../configuration/appState";
import Folder from "./Folder";
import AddIcon from '@material-ui/icons/Add';
import AddFolderModalStateStore from "../../configuration/stateStores/addFolderModalStateStore";
import UIStateStore from "../../configuration/stateStores/uiStateStore";
import addNewSwimFolder from "../../api/addNewSwimFolder";
import updateSwimWorkoutFolder from "../../api/updateSwimWorkoutFolder";
import { getWorkoutsInFolder } from "../../containers/WorkoutFolderPage";
import getSwimFoldersOfUser from "../../api/getSwimFoldersOfUser";
import getChildFolders from "../../api/getChildFolders";

export interface AddWorkoutToFolderModalProps extends RouteComponentProps<any>{
    appState?: AppStateStore;
    userState?: UserStateStore;
    uiState?: UIStateStore;
    workout: SwimWorkout;
    modalState: any;
}

export function isWorkoutInAnyFolder(folders: SwimFolder[], workout: SwimWorkout){
    for(let i = 0; i < folders.length; i++){
        let workoutString = workout.username + "," + workout.workout_id;
        let index = folders[i].workouts.indexOf(workoutString);

        if(index !== -1){
            return true;
        }
    }

    //it's not in any folder.
    return false;
}

@inject("appState", "userState", "uiState")
@observer
class AddWorkoutToFolderModal extends React.Component<AddWorkoutToFolderModalProps>{
    @observable loading: boolean = true;
    @observable folders: SwimFolder[] = [];

    get userState(){
        return this.props.userState as UserStateStore;
    }

    get appState(){
        return this.props.appState as AppStateStore;
    }

    get uiState(){
        return this.props.uiState as UIStateStore;
    }

    handleCheck = (checked: boolean, folder: SwimFolder) => {
        let workoutString = this.props.workout.username + "," + this.props.workout.workout_id;
        let index = folder.workouts.indexOf(workoutString);

        if(checked && index === -1){
            //add this workout to this folder.
            folder.workouts.push(workoutString);
        }
        else if(!checked && index !== -1){
            //remove this workout from the folder.
            folder.workouts.splice(index, 1);
        }

        console.log("Folder: " + JSON.stringify(folder.workouts));
    }

    handleClose = () => {
        //reset the folders, since this technically stays rendered when closed.
        this.userState.mySwimFolders = JSON.parse(JSON.stringify(this.userState.mySwimFolders));
        this.props.modalState.open = false;
    }

    handleSave = async () => {
        this.loading = true;
        if(!isWorkoutInAnyFolder(this.userState.mySwimFolders, this.props.workout)){
            this.uiState.setErrorMessage("Please put your workout in at least one folder.");
            this.loading = false;
            return;
        }
        for(let i = 0; i < this.userState.mySwimFolders.length; i++){
            await updateSwimWorkoutFolder(this.userState.mySwimFolders[i]);
        }

        //get updated folders
        this.userState.mySwimFolders = await getSwimFoldersOfUser(this.userState.currentUser.username);
        //get workouts in folder since it is possible that it changed.
        if(this.userState.currentFolder.folder_name !== ""){
            const resp = await getSwimFolder(this.userState.currentFolder.owner_username, this.userState.currentFolder.folder_name);
            this.userState.childFoldersOfCurrent = await getChildFolders(this.userState.currentUser.username, this.userState.currentFolder.folder_name);
            this.userState.currentFolder = resp[0];
            this.loading = false;
            this.handleClose();
            this.uiState.setSuccessMessage("Successfully saved!");

            this.userState.currentDirWorkouts = await getWorkoutsInFolder(this.userState.currentFolder);
        }
        console.log("Current directory workouts now: " + JSON.stringify(this.userState.currentDirWorkouts));
    }

    returnCheckBoxes = () => {
        let boxes = [];
        let workoutString = this.props.workout.username + "," + this.props.workout.workout_id;

        for(let i = 0; i < this.userState.mySwimFolders.length; i++){
            boxes.push(
                <Grid key = {this.userState.mySwimFolders[i].folder_name} item>
                    <FormControlLabel
                        control = {
                            <Checkbox
                                checked = {this.userState.mySwimFolders[i].workouts.indexOf(workoutString) !== -1}
                                color = "primary"
                                onChange = {(event) => this.handleCheck(event.target.checked, this.userState.mySwimFolders[i])}
                            />
                        }
                        label = {this.userState.mySwimFolders[i].folder_name}
                    />
                </Grid>
            )
        }

        return boxes;
    }

    render(){
        return(
            <Dialog
                open={this.props.modalState.open}
                onClose={this.handleClose}
            >
                <DialogTitle>
                    Add / Remove from Folders
                </DialogTitle>

                <div style = {{width: "100%"}}>
                    <Divider/>
                </div>

                <DialogContent>
                    <Grid container direction = "row" justify = "center" alignItems = "center">
                        {this.loading &&
                            <Grid item>
                                <CircularProgress/>
                            </Grid>
                        }

                        {!this.loading && this.returnCheckBoxes()}
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button
                        style = {{textTransform: "initial"}}
                        variant = "contained"
                        color = "default"
                        onClick = {this.handleClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        style = {{textTransform: "initial"}}
                        variant = "contained"
                        disabled = {this.loading}
                        color = "primary"
                        onClick = {this.handleSave}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    async componentDidMount(){
        if(this.userState.needToUpdateFolders){
            this.userState.mySwimFolders = await getSwimFoldersOfUser(this.userState.currentUser.username);
            this.userState.needToUpdateFolders = false;
        }
        this.loading = false;
    }
}

export default withRouter<AddWorkoutToFolderModalProps, any>(AddWorkoutToFolderModal);