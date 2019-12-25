import React from "react";
import { observer, inject } from "mobx-react";
import { Grid, Button, Paper, Container, Box, Icon, Typography, Divider } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";
import { AppStateStore } from "../../configuration/stateStores/appStateStore";
import UserStateStore from "../../configuration/stateStores/userStateStore";
import { SwimFolder } from "../../configuration/appState";
import { SECONDARY } from "../..";
import { green } from "@material-ui/core/colors";
import { observable } from "mobx";
import deleteSwimFolder from "../../api/deleteSwimFolder";
import UIStateStore from "../../configuration/stateStores/uiStateStore";
import getSwimFolder from "../../api/getSwimWorkoutFolder";

export interface FolderProps extends RouteComponentProps<any>{
    appState?: AppStateStore;
    userState?: UserStateStore;
    uiState?: UIStateStore;
    folder: SwimFolder;
}

//updated
@inject("appState", "userState", "uiState")
@observer
class Folder extends React.Component<FolderProps>{
    @observable deleting: boolean = false;

    get userState(){
        return this.props.userState as UserStateStore;
    }

    get appState(){
        return this.props.appState as AppStateStore;
    }

    get uiState(){
        return this.props.uiState as UIStateStore;
    }

    handleDelete = async () => {
        this.deleting = true;
        const result = await deleteSwimFolder(this.props.folder.owner_username, this.props.folder.folder_name);
        if(!result){
            this.uiState.setErrorMessage("Folder could not be deleted.");
        }
        else{
            this.userState.mySwimFolders = await getSwimFolder(this.props.folder.owner_username, this.props.folder.parent);
            this.uiState.setSuccessMessage("Folder deleted successfully.");
        }
        this.deleting = false;
    }

    handleView = () => {
        this.props.history.push("/folder/" + this.props.folder.owner_username + "/" + this.props.folder.folder_name);
    }

    render(){
        return(
            <Paper style = {{backgroundColor: green[50]}}>
                <Grid container direction = "column" spacing = {1} justify = "center" alignItems = "center">
                    <Grid item>
                        <Typography>
                            <b>{this.props.folder.folder_name}</b>
                        </Typography>
                    </Grid>

                    <Grid item style = {{width: "100%"}}>
                        <Divider/>
                    </Grid>

                    <Grid style = {{paddingLeft: 10, paddingRight: 10}} container item direction = "row" spacing = {1}>
                        <Grid item>
                            <Button onClick = {this.handleView} variant = "outlined" style = {{textTransform: "initial"}}>
                                View Folder
                            </Button>
                        </Grid>

                        {this.userState.currentUser.username === this.props.folder.owner_username && 
                            <Grid item>
                                <Button 
                                    onClick = {this.handleDelete} 
                                    disabled = {this.deleting} 
                                    variant = "outlined" 
                                    style = {{textTransform: "initial"}}
                                >
                                    Delete Folder
                                </Button>
                            </Grid>
                        }
                    </Grid>

                    <Grid item>
                        <Typography variant = "caption">
                            Workouts in This Folder: {this.props.folder.workouts.length}
                        </Typography>
                    </Grid>

                    <Grid style = {{padding: 10}} item>
                        <Typography variant = "caption">
                            Folders in This Folder: {this.props.folder.folders.length}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}

export default withRouter<FolderProps, any>(Folder);