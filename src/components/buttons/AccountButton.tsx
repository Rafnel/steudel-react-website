import React, { Fragment } from "react";
import { Tooltip, IconButton, Icon, Popper, Paper, ClickAwayListener, MenuList, MenuItem, Fade } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { green } from "@material-ui/core/colors";
import { Auth } from "aws-amplify";
import { resetState, globalState } from "../../configuration/appState";

export interface AccountButtonState{
    popperOpen: boolean;
    popperAnchor: any;
}

class AccountButton extends React.Component<RouteComponentProps<any>, AccountButtonState>{
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

    handlePopperClose(){
        this.setState({popperOpen: false});
    }

    handleLogout = async (event: any) => {
        await Auth.signOut();
    
        //reset the app's state since the user logged out.
        resetState();
        globalState.appState.successMessage = "Logged out successfully.";
        this.props.history.push("/login");
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
                        {globalState.appState.isLoggedIn 
                        ?
                        <MenuItem onClick = {this.handleLogout}>
                            Log out
                        </MenuItem>
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
                        <Icon color = "secondary">account_circle</Icon>
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

export default withRouter<RouteComponentProps<any>, any>(AccountButton);