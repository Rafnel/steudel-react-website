import React from "react";
import { Card, CardHeader, CardContent, Icon, Typography, Grid, Button, CardMedia, CardActions } from "@material-ui/core";
import { url } from "inspector";


//updated
export default class ContactCard extends React.Component{
    render(){
        return(
            <Card>
                <CardHeader
                    title = "Creator: Zachary Steudel"
                    subheader = "Junior Computer Science Student at Baylor University"
                />

                <CardMedia>
                    <Grid container justify = "center">
                        <img alt = "" src="/swimming_me.jpg" />
                    </Grid>
                </CardMedia>

                <CardContent>
                    <Grid container direction = "row" alignItems = "flex-start" justify = "flex-start" spacing = {1}>
                        <Grid item>
                            <Icon>email</Icon>
                        </Grid>

                        <Grid item>
                            <Typography variant = "body1">
                                admin@rafnel.com
                            </Typography>
                        </Grid>
                    </Grid>

                    <Typography variant = "body1">
                            Please feel free to email me with questions,<br/> suggestions, or any comments!
                    </Typography>
                </CardContent>

                <CardActions>
                    <Button variant = "outlined" color = "default" href = "https://github.com/Rafnel/steudel-react-website">
                        <Icon>code</Icon>
                        &nbsp;GitHub
                    </Button>

                    <a style = {{display: "inline-block", backgroundColor: "#FC4C02", color: "#fff", padding: "5px 10px 5px 30px", fontSize: "11px", fontFamily: "Helvetica, Arial, sans-serif", whiteSpace: "nowrap", textDecoration: "none", backgroundRepeat: "no-repeat", backgroundPosition: "10px center", borderRadius: "3px", backgroundImage:"url('http://badges.strava.com/logo-strava-echelon.png')"}} href='http://strava.com/athletes/48677897' target="_clean">
                        Follow me on
                        <img src='http://badges.strava.com/logo-strava.png' alt='Strava' style = {{marginLeft: "2px", verticalAlign: "text-bottom"}} height = {13} width = {51} />
                    </a>
                </CardActions>
            </Card>
        )
    }
}