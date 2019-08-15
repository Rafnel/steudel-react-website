import React from "react";
import { Card, CardHeader, CardContent, Icon, Typography, Grid, Button, CardMedia, CardActions } from "@material-ui/core";



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
                        <img src="/swimming_me.jpg" />
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
                </CardActions>
            </Card>
        )
    }
}