import React, { Fragment } from "react";
import { Tooltip, IconButton, Icon, Popper, Paper, ClickAwayListener, MenuList, MenuItem, Fade } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { green } from "@material-ui/core/colors";
import { Auth } from "aws-amplify";
import { resetState, globalState } from "../../configuration/appState";

export interface QuestionButtonState{
    popperOpen: boolean;
    popperAnchor: any;
}

class QuestionButton extends React.Component<RouteComponentProps<any>, QuestionButtonState>{
    constructor(props: RouteComponentProps<any>){
        super(props);

        this.state = {
            popperOpen: false,
            popperAnchor: null
        }
        
        //bind the handle functions to this class so that we can set state from within it.
        this.handlePopperClose = this.handlePopperClose.bind(this);
        this.handleAbout = this.handleAbout.bind(this);
        this.handleContactCreator = this.handleContactCreator.bind(this);
    }

    handlePopperClose(){
        this.setState({popperOpen: false});
    }

    handleAbout(){

        this.handlePopperClose();
    }

    handleContactCreator(){
        this.props.history.push("/contact");
        this.handlePopperClose();
    }

    popperContent(){
        return(
            <Paper style = {{backgroundColor: green[50]}}>
                <ClickAwayListener onClickAway = {this.handlePopperClose}>
                    <MenuList>
                        <MenuItem onClick = {this.handleAbout}>
                            About this Website
                        </MenuItem>

                        <MenuItem onClick = {this.handleContactCreator}>
                            Contact the Creator
                        </MenuItem>
                    </MenuList>
                </ClickAwayListener>
            </Paper>
        )
    }

    render(){
        return(
            <Fragment>
                <Tooltip title = "About / Contact Information">
                    <IconButton 
                        style = {{marginLeft: "auto"}}
                        size = "medium"
                        onClick = {(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => this.setState({popperOpen: !this.state.popperOpen, popperAnchor: event.currentTarget})}
                    >
                        <Icon color = "secondary">contact_support</Icon>
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

export default withRouter<RouteComponentProps<any>, any>(QuestionButton);