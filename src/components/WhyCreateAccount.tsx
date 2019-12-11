import { Grid, Typography } from "@material-ui/core";
import React from "react";



//updated
export default class WhyCreateAccount extends React.Component{
    render(){
        return(
            <Grid container justify = "flex-start" alignItems = "flex-start" direction = "column">
                <Grid item>
                    <ul>
                        <li>
                            Create their own swim components
                        </li>
                        <li>
                            Explore components created by other users and like those components to save
                            them to their account
                        </li>
                        <li>
                            Create their own full swim workouts
                        </li>
                        <li>
                            View their created workouts and export them as PDFs
                        </li>
                    </ul>
                </Grid>
            </Grid>
        )
    }
}