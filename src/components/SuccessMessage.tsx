import React from "react";
import { Snackbar, SnackbarContent, IconButton } from "@material-ui/core";
import AppStateStore, { appState } from "../stateStores/appState";
import { PRIMARY } from "..";
import CloseIcon from '@material-ui/icons/Close';

export default class SuccessMessage extends React.Component{
    render(){
        return(
            <Snackbar 
                open = {true} 
                autoHideDuration = {8000} 
                onClose = {() => appState.successMessage = ""}
            >
                <SnackbarContent 
                    style = {{backgroundColor: PRIMARY}}
                    message = {appState.successMessage}
                    action = {<IconButton 
                                color="inherit" 
                                key = "close" 
                                aria-label = "close" 
                                onClick = {() => appState.successMessage = ""}
                                > 
                                    <CloseIcon/>
                                </IconButton>}/>
            </Snackbar>
        )
    }
}