import React from "react";
import { Snackbar, SnackbarContent, IconButton } from "@material-ui/core";
import AppStateStore from "../stateStores/appState";
import { PRIMARY } from "..";
import CloseIcon from '@material-ui/icons/Close';

export interface SuccessMessageProps{
    appState: AppStateStore;
}

export default class SuccessMessage extends React.Component<SuccessMessageProps>{
    render(){
        return(
            <Snackbar 
                open = {true} 
                autoHideDuration = {8000} 
                onClose = {() => this.props.appState.successMessage = ""}
            >
                <SnackbarContent 
                    style = {{backgroundColor: PRIMARY}}
                    message = {this.props.appState.successMessage}
                    action = {<IconButton 
                                color="inherit" 
                                key = "close" 
                                aria-label = "close" 
                                onClick = {() => this.props.appState.successMessage = ""}
                                > 
                                    <CloseIcon/>
                                </IconButton>}/>
            </Snackbar>
        )
    }
}