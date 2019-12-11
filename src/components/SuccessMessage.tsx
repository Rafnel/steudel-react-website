import React from "react";
import { Snackbar, SnackbarContent, IconButton } from "@material-ui/core";
import { PRIMARY } from "..";
import CloseIcon from '@material-ui/icons/Close';
import { inject } from "mobx-react";
import UIStateStore from "../configuration/stateStores/uiStateStore";

export interface SuccessMessageProps{
    uiState?: UIStateStore
}

//updated
@inject("uiState")
export default class SuccessMessage extends React.Component<SuccessMessageProps>{
    get uiState(){
        return this.props.uiState as UIStateStore;
    }
    
    render(){
        return(
            <Snackbar 
                open = {true} 
                autoHideDuration = {8000} 
                onClose = {() => this.uiState.setSuccessMessage("")}
            >
                <SnackbarContent 
                    style = {{backgroundColor: PRIMARY}}
                    message = {this.uiState.successMessage}
                    action = {<IconButton 
                                color="inherit" 
                                key = "close" 
                                aria-label = "close" 
                                onClick = {() => this.uiState.setSuccessMessage("")}
                                > 
                                    <CloseIcon/>
                                </IconButton>}/>
            </Snackbar>
        )
    }
}