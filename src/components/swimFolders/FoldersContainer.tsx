import React from "react";
import { observer, inject } from "mobx-react";
import { Grid, Button, Paper, Container, Box, Icon, Typography, Divider, CircularProgress, IconButton, Tooltip } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";
import { AppStateStore } from "../../configuration/stateStores/appStateStore";
import UserStateStore from "../../configuration/stateStores/userStateStore";
import { observable } from "mobx";
import getSwimFolder from "../../api/getSwimWorkoutFolder";
import { SwimFolder } from "../../configuration/appState";
import Folder from "./Folder";
import AddIcon from '@material-ui/icons/Add';
import AddFolderModalStateStore from "../../configuration/stateStores/addFolderModalStateStore";
import AddFolderModal from "./AddFolderModal";
import getChildFolders from "../../api/getChildFolders";

export interface FoldersContainerProps extends RouteComponentProps<any>{
    appState?: AppStateStore;
    userState?: UserStateStore;
    addFolderModalState?: AddFolderModalStateStore;
    folder: string;
    username: string;
}

@inject("appState", "userState", "addFolderModalState")
@observer
class FoldersContainer extends React.Component<FoldersContainerProps>{
    @observable loadingFolders = true;

    get userState(){
        return this.props.userState as UserStateStore;
    }

    get addFolderModalState(){
        return this.props.addFolderModalState as AddFolderModalStateStore;
    }

    get appState(){
        return this.props.appState as AppStateStore;
    }

    handleAddFolder = () => {
        this.addFolderModalState.open = true;
    }

    returnFolders = () => {
        let folders = [];

        for(let i = 0; i < this.userState.childFoldersOfCurrent.length; i++){
            folders.push(
                <Grid key = {this.userState.childFoldersOfCurrent[i].folder_name} item>
                    <Folder folder = {this.userState.childFoldersOfCurrent[i]}/>
                </Grid>
            )
        }

        if(folders.length === 0){
            folders.push(
                <Grid key = {0} item>
                    <Typography>
                        No child folders!
                    </Typography>
                </Grid>
            )
        }

        return folders;
    }

    render(){
        return(
            <Paper style = {{width: "70vw"}}>
                <div style = {{width: "100%"}}>
                    <Grid style = {{padding: 10}} container justify = "space-between" alignItems = "center">
                        <Grid item>
                            <Typography style = {{display: "inline-block"}} variant = "h6">
                                Folders in the {this.props.folder} Directory
                            </Typography>
                        </Grid>

                        {this.userState.currentUser.username === this.props.username && 
                            <Grid item>
                                <Tooltip title = "Add folder here">
                                    <IconButton onClick = {this.handleAddFolder} style = {{display: "inline-block", float: "right"}}>
                                        <AddIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        }
                    </Grid>

                    <div style = {{display: "block", clear: "both"}}>
                        <Divider/>
                    </div>

                    {this.loadingFolders && 
                        <div>
                            <CircularProgress/>
                        </div>
                    }
                </div>

                {!this.loadingFolders &&
                    <Grid item spacing = {2} container justify = "center" alignItems = "center" style = {{padding: 10}} direction = "row">
                        {this.returnFolders()}
                    </Grid>
                }
                <AddFolderModal username = {this.props.username} folder = {this.props.folder}/>
            </Paper>
        )
    }

    async componentDidMount(){
        this.userState.childFoldersOfCurrent = await getChildFolders(this.props.username, this.props.folder);
        this.loadingFolders = false;
    }
}

export default withRouter<FoldersContainerProps, any>(FoldersContainer);