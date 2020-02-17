import React, { Fragment } from "react";
import { SwimComponent } from "../../configuration/appState";
import { observer } from "mobx-react";
import { Typography, Grid } from "@material-ui/core";

export interface OneLineSwimComponentProps{
    component: SwimComponent;
}

//updated
@observer
export default class OneLineSwimComponent extends React.Component<OneLineSwimComponentProps>{    
    render(){
        return(
            <div style = {{width: "100%"}}>
                <Typography style = {{display: "inline-block"}} variant = "body2">
                    {this.props.component.component_body.split("\n").map((line) => {return <Fragment>{line}<br/></Fragment>})}
                </Typography>

                <Typography style = {{float: "right", display: "inline-block"}} variant = "body2">
                    <b>{this.props.component.intervals.join(" / ")}</b>
                </Typography>
            </div>
        )
    }
}