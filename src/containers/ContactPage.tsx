import React from "react";
import { Grid } from "@material-ui/core";
import ContactCard from "../components/ContactCard";
import { inject, observer } from "mobx-react";


//updated
@inject()
@observer
export default class ContactPage extends React.Component{
    render(){
        return(
            <Grid container justify = "center" alignItems = "center" direction = "column">
                <Grid item>
                    <ContactCard/>
                </Grid>
            </Grid>
        )
    }
}