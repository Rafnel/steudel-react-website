import React from "react";
import { globalState } from "../configuration/appState";
import { Grid, Typography } from "@material-ui/core";
import { observer } from "mobx-react";
import { PRIMARY } from "..";
import HeaderBar from "../components/HeaderBar";
import RiseLoader from 'react-spinners/RiseLoader';


@observer
export default class LoadingPage extends React.Component{
    render(){
        if(globalState.appState.isAuthenticating){
            return(
                <div>
                    <HeaderBar/>
                    &nbsp;
                    <Grid container justify = "center" spacing = {10} alignItems = "center" direction = "column">
                    
                        <Grid item>
                            <Typography variant = "h2">
                                Loading . . .
                            </Typography>
                        </Grid>

                        <Grid item>
                            <RiseLoader margin = "4px" color = {PRIMARY} size = {30}/>
                        </Grid>
                    </Grid>
                </div>
            )
        }
        else{
            return null;
        }
    }
} 