import React, { Fragment } from "react";
import { Tooltip, IconButton, Popper, Paper, ClickAwayListener, MenuList, MenuItem, Fade, Divider } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { green } from "@material-ui/core/colors";
import UIStateStore from "../../configuration/stateStores/uiStateStore";
import { inject, observer } from "mobx-react";
import UserStateStore from "../../configuration/stateStores/userStateStore";
import { AppStateStore } from "../../configuration/stateStores/appStateStore";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { WorkoutState } from "./SwimWorkout";
import updateLastUsed from "../../api/updateWorkoutUsedDate";
import { SwimWorkout } from "../../configuration/appState";
import AddWorkoutToFoldersModal from "../swimFolders/AddWorkoutToFoldersModal";
import { observable } from "mobx";

export interface WorkoutActionButtonState{
    popperOpen: boolean;
    popperAnchor: any;
}

export interface WorkoutActionButtonProps{
    uiState?: UIStateStore;
    appState?: AppStateStore;
    userState?: UserStateStore;
    workoutState: WorkoutState;
    workout: SwimWorkout;
}

//updated
@inject("uiState", "appState", "userState", "addFolderModalState")
@observer
class WorkoutActionButton extends React.Component<RouteComponentProps<any> & WorkoutActionButtonProps, WorkoutActionButtonState>{
    @observable modalState = {
        open: false
    }

    constructor(props: RouteComponentProps<any> & WorkoutActionButtonProps){
        super(props);

        this.state = {
            popperOpen: false,
            popperAnchor: null
        }
        
        //bind the handle functions to this class so that we can set state from within it.
        this.handlePopperClose = this.handlePopperClose.bind(this);
    }

    get uiState(){
        return this.props.uiState as UIStateStore;
    }

    get appState(){
        return this.props.appState as AppStateStore;
    }

    get userState(){
        return this.props.userState as UserStateStore;
    }

    handlePopperClose(){
        this.setState({popperOpen: false});
    }

    //downloads the workout to user's device
    exportWorkoutPDF = () => {
        this.props.workoutState.downloadPressed = true;
        setTimeout(() => {
            this.props.workoutState.workout.save();
            this.props.workoutState.downloadPressed = false;
        }, 50)
    }

    markWorkoutUsed = async () => {
        this.props.workoutState.markingComplete = true;
        this.handlePopperClose();
        await updateLastUsed(this.props.workout.workout_id, this.userState.currentUser.username);
        this.props.workoutState.last_used = new Date().toLocaleString("en-US", {timeZone: "America/Chicago"}).toString();
        this.props.workoutState.markingComplete = false;
    }

    popperContent(){
        return(
            <Paper style = {{backgroundColor: green[50]}}>
                <ClickAwayListener onClickAway = {this.handlePopperClose}>
                    <MenuList>
                        <MenuItem onClick = {this.exportWorkoutPDF}>
                            Download Workout
                        </MenuItem>

                        {this.props.workout.username === this.userState.currentUser.username &&
                            <MenuItem disabled = {this.props.workoutState.markingComplete} onClick = {this.markWorkoutUsed}>
                                Mark as Used
                            </MenuItem>
                        }

                        {this.props.workout.username === this.userState.currentUser.username &&
                            <MenuItem onClick = {() => this.modalState.open = true}>
                                Manage Folders for this Workout
                            </MenuItem>
                        }
                    </MenuList>
                </ClickAwayListener>
            </Paper>
        )
    }

    render(){
        return(
            <Fragment>
                <Tooltip title = "Actions">
                    <IconButton 
                        style = {{marginLeft: "auto"}}
                        size = "medium"
                        onClick = {(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => this.setState({popperOpen: !this.state.popperOpen, popperAnchor: event.currentTarget})}
                    >
                        <MoreVertIcon/>
                    </IconButton>
                </Tooltip>
                
                <Popper
                    open = {this.state.popperOpen}
                    placement = "bottom"
                    anchorEl = {this.state.popperAnchor}
                    transition
                >
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout = {350}>
                            {this.popperContent()}
                        </Fade>
                    )}
                </Popper>

                <AddWorkoutToFoldersModal workout = {this.props.workout} modalState = {this.modalState}/>
            </Fragment>
        )
    }
}

export default withRouter<RouteComponentProps<any> & WorkoutActionButtonProps, any>(WorkoutActionButton);