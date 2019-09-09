import { RouteComponentProps, withRouter } from "react-router-dom";
import React from "react";
import { Tooltip, IconButton, Icon } from "@material-ui/core";

class WeatherButton extends React.Component<RouteComponentProps<any>>{
    render(){
        return(
            <Tooltip title = "Check the weather before your workout!">
                <IconButton 
                    style = {{justifyContent: "flex-end"}}
                    size = "medium"
                    onClick = {() => this.props.history.push("/weather")}
                >
                    <Icon color = "error">wb_sunny</Icon>
                </IconButton>
            </Tooltip>
        )
    }
}

export default withRouter<RouteComponentProps<any>, any>(WeatherButton);