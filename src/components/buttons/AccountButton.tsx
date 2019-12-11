import React, { Fragment } from "react";
import { Tooltip, IconButton, Icon, Popper, Paper, ClickAwayListener, MenuList, MenuItem, Fade, Divider } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { green } from "@material-ui/core/colors";
import UIStateStore from "../../configuration/stateStores/uiStateStore";
import { inject } from "mobx-react";
import UserStateStore from "../../configuration/stateStores/userStateStore";
import { AppStateStore } from "../../configuration/stateStores/appStateStore";
import { logOut } from "../../configuration/cognitoAPI";

export interface AccountButtonState{
    popperOpen: boolean;
    popperAnchor: any;
}

export interface AccountButtonProps{
    uiState?: UIStateStore;
    appState?: AppStateStore;
    userState?: UserStateStore;
}

//updated
@inject("uiState", "appState", "userState")
class AccountButton extends React.Component<RouteComponentProps<any> & AccountButtonProps, AccountButtonState>{
    constructor(props: RouteComponentProps<any>){
        super(props);

        this.state = {
            popperOpen: false,
            popperAnchor: null
        }
        
        //bind the handle functions to this class so that we can set state from within it.
        this.handlePopperClose = this.handlePopperClose.bind(this);
        this.handleClickLogIn = this.handleClickLogIn.bind(this);
        this.handleClickSignUp = this.handleClickSignUp.bind(this);
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

    handleClickMyWorkouts = async (event: any) => {
        this.props.history.push("/my-workouts");
        this.handlePopperClose();
    }

    handleLogout = async (event: any) => {
        await logOut();
        this.props.history.push("/");
        this.appState.isLoggedIn = false;
        //reset state to logged out state
        this.appState.resetState();
        this.userState.resetState();
    
        this.uiState.setSuccessMessage("Logged out successfully.");
        this.handlePopperClose();
    }

    handleClickLogIn(){
        this.props.history.push("/login");
        this.handlePopperClose();
    }

    handleClickSignUp(){
        this.props.history.push("/signup");
        this.handlePopperClose();
    }

    popperContent(){
        return(
            <Paper style = {{backgroundColor: green[50]}}>
                <ClickAwayListener onClickAway = {this.handlePopperClose}>
                    <MenuList>
                        {this.appState.isLoggedIn 
                        ?
                        <Fragment>
                            <MenuItem onClick = {this.handleClickMyWorkouts}>
                                My Workouts
                            </MenuItem>

                            <Divider/>

                            <MenuItem onClick = {this.handleLogout}>
                                Log out
                            </MenuItem>
                        </Fragment>
                        
                        :
                        <Fragment>
                            <MenuItem onClick = {this.handleClickLogIn}>
                                Log In
                            </MenuItem>

                            <MenuItem onClick = {this.handleClickSignUp}>
                                Sign Up
                            </MenuItem>
                        </Fragment>
                        }

                    </MenuList>
                </ClickAwayListener>
            </Paper>
        )
    }

    render(){
        return(
            <Fragment>
                <Tooltip title = "Account">
                    <IconButton 
                        style = {{marginLeft: "auto"}}
                        size = "medium"
                        onClick = {(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => this.setState({popperOpen: !this.state.popperOpen, popperAnchor: event.currentTarget})}
                    >
                        <Icon color = "error">account_circle</Icon>
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
            </Fragment>
            
        )
    }
}

export default withRouter<RouteComponentProps<any> & AccountButtonProps, any>(AccountButton);