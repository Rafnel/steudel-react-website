import React from "react";
import { observer, inject } from "mobx-react";
import { Grid, Button, Paper, Container, Box, Icon, Typography, Divider, CircularProgress, IconButton, Tooltip, DialogTitle, Dialog, DialogContent, TextField, DialogActions } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";
import { AppStateStore } from "../../configuration/stateStores/appStateStore";
import UserStateStore from "../../configuration/stateStores/userStateStore";
import { observable } from "mobx";
import getSwimFolder from "../../api/getSwimWorkoutFolder";
import { SwimFolder } from "../../configuration/appState";
import Folder from "./Folder";
import AddIcon from '@material-ui/icons/Add';
import AddFolderModalStateStore from "../../configuration/stateStores/addFolderModalStateStore";
import UIStateStore from "../../configuration/stateStores/uiStateStore";
import addNewSwimFolder from "../../api/addNewSwimFolder";

export interface AddFolderModalProps extends RouteComponentProps<any>{
    appState?: AppStateStore;
    userState?: UserStateStore;
    addFolderModalState?: AddFolderModalStateStore;
    uiState?: UIStateStore;
    username: string;
    folder: string;
}

@inject("appState", "userState", "addFolderModalState", "uiState")
@observer
class AddFolderModal extends React.Component<AddFolderModalProps>{
    newFolderName: string = "";
    @observable loading: boolean = false;

    get userState(){
        return this.props.userState as UserStateStore;
    }

    get appState(){
        return this.props.appState as AppStateStore;
    }

    get uiState(){
        return this.props.uiState as UIStateStore;
    }

    get addFolderModalState(){
        return this.props.addFolderModalState as AddFolderModalStateStore;
    }

    handleAddFolder = async () => {
        //check that the folder isn't "main"
        if(this.newFolderName === "main"){
            this.uiState.setErrorMessage("This folder name is already in use. Choose a different name.");
            return;
        }
        //check not empty
        if(this.newFolderName === ""){
            this.uiState.setErrorMessage("Please enter a name for the folder.");
            return;
        }

        this.loading = true;
        const result = await addNewSwimFolder(this.props.username, this.newFolderName, this.props.folder);

        if(result === null){
            this.uiState.setErrorMessage("This folder name is already in use. Choose a different name.");
            this.loading = false;
            return;
        }
        else{
            this.userState.mySwimFolders = await getSwimFolder(this.props.username, this.props.folder);
            this.uiState.setSuccessMessage("Successfully added your folder!");
        }

        this.loading = false;
        this.handleClose();
    }

    handleClose = () => {
        this.addFolderModalState.open = false;
    }

    render(){
        return(
            <Dialog
                open={this.addFolderModalState.open}
                onClose={this.handleClose}
            >
                <DialogTitle>
                    Add Folder Within the {this.props.folder} Folder
                </DialogTitle>

                <div style = {{width: "100%"}}>
                    <Divider/>
                </div>

                <DialogContent>
                    <Grid container direction = "column" justify = "center" alignItems = "center">
                        <Grid item>
                            <TextField
                                variant = "outlined"
                                label = "Folder Name"
                                margin = "dense"
                                onKeyPress = {(event) => {
                                    if(event.key === "Enter"){
                                        this.handleAddFolder();
                                    }
                                }}
                                onChange = {(event) => this.newFolderName = event.target.value}
                            />
                        </Grid>
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
                        onClick = {this.handleAddFolder}
                    >
                        Create Folder
                    </Button>
                </DialogActions>
            
            </Dialog>

        )
    }
}

export default withRouter<AddFolderModalProps, any>(AddFolderModal);