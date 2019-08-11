import React from "react";
import { globalState } from "../stateStores/appState";
import { Grid, Typography } from "@material-ui/core";
import { observer } from "mobx-react";
import ReactLoading from 'react-loading';
import { PRIMARY } from "..";
import HeaderBar from "../components/HeaderBar";


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
                            <ReactLoading type = "bubbles" color = {PRIMARY} height={200} width={200}/>
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