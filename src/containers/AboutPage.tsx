import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { observer, inject } from "mobx-react";
import { observable } from "mobx";
import ExampleSetAbout from "../components/ExampleSetAbout";
import WhyCreateAccount from "../components/WhyCreateAccount";

//updated
//need to inject all pages, even with nothing, due to react router
@inject()
@observer
export default class AboutPage extends React.Component{
    @observable activeTab: number = 0;

    render(){
        return(
            <Grid container alignItems = "center" justify = "center" spacing = {2}>
                <Box width = "75%" bgcolor = "background.paper">
                    <Grid container justify = "center" alignItems = "center" direction = "column" spacing = {2}>
                        <Grid item>
                            <Typography variant = "h4">
                                What is Rafnel?
                            </Typography>
                        </Grid>

                        <Grid container justify = "flex-start" alignItems = "flex-start" direction = "column">
                            <Grid item>
                                <Typography variant = "body1">
                                    At its core, Rafnel is a website to allow athletes and coaches to create, share, and acquire
                                    swimming workouts and <b>components</b> of workouts.
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography variant = "h4">
                                Components
                            </Typography>
                        </Grid>

                        <Grid container justify = "flex-start" alignItems = "flex-start" direction = "column">
                            <Grid item>
                                <Typography variant = "body1">
                                    A component is the natural building block of a swimming set.
                                    A full swim practice might be made up of four sets, those being the
                                    Warmup, Pre Set, Main Set, and Cooldown. An example
                                    Pre Set might look like this:
                                </Typography>
                            </Grid>
                        </Grid>

                        &nbsp;

                        <Grid item>
                            <Box width = "90%" bgcolor = "background.paper">
                                <Grid container justify = "center" alignItems = "center" direction = "column" spacing = {2}>
                                    <ExampleSetAbout/>
                                </Grid>
                            </Box>
                        </Grid>

                        &nbsp;

                        <Grid container justify = "flex-start" alignItems = "flex-start" direction = "column">
                            <Grid item>
                                This pre set can be naturally separated into 3 components, those being the 6 x 75, 4 x 50, and the
                                5 x 100. Rafnel.com is all about creating and using these building blocks to construct workouts
                                and allow coaches and swimmers to build and find engaging practices. 
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography variant = "h4">
                                Accounts
                            </Typography>
                        </Grid>

                        <Grid item>
                            Accounts are free, and as of version 1.00 users can:
                        </Grid>
                        <WhyCreateAccount/>
                    </Grid>
                </Box>
            </Grid>      
        )
    }
}