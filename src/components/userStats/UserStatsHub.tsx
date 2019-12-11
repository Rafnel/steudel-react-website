import React from "react";
import { Paper, Grid, Typography, Divider } from "@material-ui/core";
import ComponentsHub from "./ComponentsHub";
import WorkoutsHub from "./WorkoutsHub";


//updated
export default class UserStatsHub extends React.Component{
    render(){
        return(
            <Paper style = {{padding: 10}}>
                <Grid container justify = "center" alignItems = "center" direction = "column" spacing = {2}>
                    <Grid item>
                        <Typography variant = "h2">
                            Your Activity Hub
                        </Typography>
                        &nbsp;
                        <Divider/>
                    </Grid>

                    <Grid item>
                        <WorkoutsHub/>
                    </Grid>

                    <Grid item>
                        <ComponentsHub/>
                    </Grid>

                </Grid>
            </Paper>
        )
    }
}