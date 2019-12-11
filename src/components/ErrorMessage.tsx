import React from "react";
import { Snackbar, SnackbarContent, IconButton } from "@material-ui/core";
import { ERROR } from "..";
import CloseIcon from '@material-ui/icons/Close';
import UIStateStore from "../configuration/stateStores/uiStateStore";
import { inject } from "mobx-react";

export interface ErrorMessageProps{
    uiState?: UIStateStore
}

//updated
@inject("uiState")
export default class ErrorMessage extends React.Component<ErrorMessageProps>{
    get uiState(){
        return this.props.uiState as UIStateStore;
    }

    render(){
        return(
            <Snackbar 
                open = {true} 
                autoHideDuration = {8000} 
                onClose = {() => this.uiState.setErrorMessage("")}
            >
                <SnackbarContent 
                    style = {{backgroundColor: ERROR}}
                    message = {this.uiState.errorMessage}
                    action = {<IconButton 
                                color="inherit" 
                                key = "close" 
                                aria-label = "close" 
                                onClick = {() => this.uiState.setErrorMessage("")}
                                > 
                                    <CloseIcon/>
                                </IconButton>}/>
            </Snackbar>
        )
    }
}