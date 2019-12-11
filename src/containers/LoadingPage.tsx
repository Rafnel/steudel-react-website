import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { observer, inject } from "mobx-react";
import { PRIMARY } from "..";
import HeaderBar from "../components/HeaderBar";
import RiseLoader from 'react-spinners/RiseLoader';
import { AppStateStore } from "../configuration/stateStores/appStateStore";

export interface LoadingPageProps{
    appState?: AppStateStore;
}

//updated
@inject("appState")
@observer
export default class LoadingPage extends React.Component<LoadingPageProps>{
    get appState(){
        return this.props.appState as AppStateStore;
    }

    render(){
        if(this.appState.isAuthenticating){
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