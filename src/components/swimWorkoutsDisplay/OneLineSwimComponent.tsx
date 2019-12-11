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
            <Grid container direction = "row" spacing = {3}>
                <Grid item>
                    <Typography variant = "h6">
                        {this.props.component.component_body.split("\n").map((line) => {return <Fragment>{line}<br/></Fragment>})}
                    </Typography>
                </Grid>

                <Grid item>
                    <Grid item>
                        <Typography variant = "h6">
                            <b>{this.props.component.intervals.join(" / ")}</b>
                        </Typography>
                    </Grid>
                </Grid>
                
            </Grid>
        )
    }
}