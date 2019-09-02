import React from "react";
import { SwimComponent } from "../../configuration/appState";
import { observer } from "mobx-react";
import { Typography, Grid } from "@material-ui/core";

export interface OneLineSwimComponentProps{
    component: SwimComponent;
}

@observer
export default class OneLineSwimComponent extends React.Component<OneLineSwimComponentProps>{    
    render(){
        return(
            <Grid container direction = "row" spacing = {3}>
                <Grid item>
                    <Typography variant = "h6">
                        {this.props.component.component_body}
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