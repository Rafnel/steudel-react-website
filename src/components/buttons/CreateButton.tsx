import React, { Fragment } from "react";
import { Tooltip, IconButton, Icon, Popper, Paper, ClickAwayListener, MenuList, MenuItem, Fade } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { green } from "@material-ui/core/colors";

export interface CreateButtonState{
    popperOpen: boolean;
    popperAnchor: any;
}
//updated
class CreateButton extends React.Component<RouteComponentProps<any>, CreateButtonState>{
    constructor(props: RouteComponentProps<any>){
        super(props);

        this.state = {
            popperOpen: false,
            popperAnchor: null
        }
        
        //bind the handle functions to this class so that we can set state from within it.
        this.handlePopperClose = this.handlePopperClose.bind(this);
        this.handleCreateSwimComponentClick = this.handleCreateSwimComponentClick.bind(this);
        this.handleCreateSwimWorkoutClick = this.handleCreateSwimWorkoutClick.bind(this);
    }

    handlePopperClose(){
        this.setState({popperOpen: false});
    }

    handleCreateSwimComponentClick(){
        this.props.history.push("/create-swim-component");
        this.handlePopperClose();
    }

    handleCreateSwimWorkoutClick(){
        this.props.history.push("/create-swim-workout")
        this.handlePopperClose();
    }

    popperContent(){
        return(
            <Paper style = {{backgroundColor: green[50]}}>
                <ClickAwayListener onClickAway = {this.handlePopperClose}>
                    <MenuList>
                        <MenuItem onClick = {this.handleCreateSwimComponentClick}>
                            Create a Swim Component
                        </MenuItem>

                        <MenuItem onClick = {this.handleCreateSwimWorkoutClick}>
                            Create a Swim Workout
                        </MenuItem>
                    </MenuList>
                </ClickAwayListener>
            </Paper>
        )
    }

    render(){
        return(
            <Fragment>
                <Tooltip title = "Create">
                    <IconButton 
                        size = "medium"
                        onClick = {(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => this.setState({popperOpen: !this.state.popperOpen, popperAnchor: event.currentTarget})}
                    >
                        <Icon color = "error">edit</Icon>
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

export default withRouter<RouteComponentProps<any>, any>(CreateButton);