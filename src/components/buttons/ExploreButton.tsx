import { RouteComponentProps, withRouter } from "react-router-dom";
import React from "react";
import { Tooltip, IconButton, Icon } from "@material-ui/core";

class ExploreButton extends React.Component<RouteComponentProps<any>>{
    render(){
        return(
            <Tooltip title = "Explore Community Components">
                <IconButton 
                    size = "medium"
                    onClick = {() => this.props.history.push("/swim-components")}
                >
                    <Icon color = "secondary">explore</Icon>
                </IconButton>
            </Tooltip>
        )
    }
}

export default withRouter<RouteComponentProps<any>, any>(ExploreButton);