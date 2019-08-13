import React from "react";
import { Snackbar, SnackbarContent, IconButton } from "@material-ui/core";
import { ERROR } from "..";
import CloseIcon from '@material-ui/icons/Close';
import { globalState } from "../configuration/appState";

export default class ErrorMessage extends React.Component{
    render(){
        return(
            <Snackbar 
                open = {true} 
                autoHideDuration = {8000} 
                onClose = {() => globalState.appState.errorMessage = ""}
            >
                <SnackbarContent 
                    style = {{backgroundColor: ERROR}}
                    message = {globalState.appState.errorMessage}
                    action = {<IconButton 
                                color="inherit" 
                                key = "close" 
                                aria-label = "close" 
                                onClick = {() => globalState.appState.errorMessage = ""}
                                > 
                                    <CloseIcon/>
                                </IconButton>}/>
            </Snackbar>
        )
    }
}