import React from "react";
import { Paper, Grid, Typography, Divider } from "@material-ui/core";
import { green } from "@material-ui/core/colors";


//updated
export default class ExampleSetAbout extends React.Component{
    render(){
        return(
            <Paper style = {{padding: 15, backgroundColor: green[50]}}>
                <Grid container justify = "center" alignItems = "center" direction = "column" spacing = {2}>
                    <Grid item>
                        <Typography variant = "h5">
                            Pre Set
                        </Typography>
                    </Grid>

                    <Grid container justify = "flex-start" alignItems = "flex-start" direction = "column" spacing = {2}>
                        <Grid item>
                            <Divider/>
                            6 x 75 IMO Kick/Drill/Swim by 25 on 1:20 / 1:25 / 1:30 / 1:40
                        </Grid>

                        <Grid item>
                            4 x 50 free swim catch-up drill on 0:50 / 0:55 / 1:00
                        </Grid>

                        <Grid item>
                            5 x 100 free swim descend 1 - 5 on 1:25 / 1:30 / 1:40 / 1:50
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}