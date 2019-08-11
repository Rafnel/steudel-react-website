import { RouteComponentProps, withRouter } from "react-router-dom";
import React from "react";
import { Tooltip, IconButton, Icon } from "@material-ui/core";

class HomeButton extends React.Component<RouteComponentProps<any>>{
    render(){
        return(
            <Tooltip title = "Main Page">
                <IconButton 
                    size = "medium"
                    onClick = {() => this.props.history.push("/")}
                >
                    <Icon color = "secondary">home</Icon>
                </IconButton>
            </Tooltip>
        )
    }
}

export default withRouter<RouteComponentProps<any>, any>(HomeButton);