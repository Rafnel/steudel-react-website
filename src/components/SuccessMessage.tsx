import React from "react";
import { Snackbar, SnackbarContent, IconButton } from "@material-ui/core";
import { PRIMARY } from "..";
import CloseIcon from '@material-ui/icons/Close';
import { globalState } from "../stateStores/appState";

export default class SuccessMessage extends React.Component{
    render(){
        return(
            <Snackbar 
                open = {true} 
                autoHideDuration = {8000} 
                onClose = {() => globalState.appState.successMessage = ""}
            >
                <SnackbarContent 
                    style = {{backgroundColor: PRIMARY}}
                    message = {globalState.appState.successMessage}
                    action = {<IconButton 
                                color="inherit" 
                                key = "close" 
                                aria-label = "close" 
                                onClick = {() => globalState.appState.successMessage = ""}
                                > 
                                    <CloseIcon/>
                                </IconButton>}/>
            </Snackbar>
        )
    }
}